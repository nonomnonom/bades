/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { isDefined } from 'shared/utils';

import type { MidtransTransactionStatus } from 'midtrans-client';

import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import { BillingCustomerEntity } from 'src/engine/core-modules/billing/entities/billing-customer.entity';
import { BillingMidtransTransactionEntity } from 'src/engine/core-modules/billing/entities/billing-midtrans-transaction.entity';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import {
  MIDTRANS_SUCCESS_STATUSES,
} from 'src/engine/core-modules/billing/midtrans/constants/midtrans-transaction-status.constant';
import { MidtransTransactionService } from 'src/engine/core-modules/billing/midtrans/services/midtrans-transaction.service';
import {
  computeMidtransSignature,
  verifyMidtransSignature,
} from 'src/engine/core-modules/billing/midtrans/utils/midtrans-signature.util';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

/**
 * Payload yang diterima dari notifikasi HTTP Midtrans.
 * Midtrans mengirim payload ini ke endpoint webhook.
 */
export type MidtransNotificationPayload = {
  order_id: string;
  transaction_status: string;
  transaction_id: string;
  gross_amount: string;
  payment_type?: string;
  status_code: string;
  signature_key?: string;
  fraud_status?: string;
  [key: string]: unknown;
};

/**
 * Service untuk memproses notifikasi webhook Midtrans.
 *
 * Alur verifikasi:
 * 1. Verifikasi signature_key dari payload
 * 2. Panggil GET Status API ke Midtrans (sumber kebenaran)
 * 3. Mapping status → update database
 * 4. Jika TOP_UP_CREDIT & settled: tambah saldo kredit
 * 5. Jika MONTHLY_BILLING & settled: update status subscription
 */
@Injectable()
export class BillingMidtransWebhookService {
  protected readonly logger = new Logger(BillingMidtransWebhookService.name);

  constructor(
    private readonly twentyConfigService: TwentyConfigService,
    private readonly midtransTransactionService: MidtransTransactionService,
    @InjectRepository(BillingMidtransTransactionEntity)
    private readonly midtransTransactionRepository: Repository<BillingMidtransTransactionEntity>,
    @InjectRepository(BillingCustomerEntity)
    private readonly billingCustomerRepository: Repository<BillingCustomerEntity>,
    @InjectRepository(BillingSubscriptionEntity)
    private readonly billingSubscriptionRepository: Repository<BillingSubscriptionEntity>,
  ) {}

  /**
   * Memproses notifikasi masuk dari Midtrans.
   * Selalu verifikasi ke Midtrans sebelum mengambil aksi finansial.
   */
  async processNotification(
    payload: MidtransNotificationPayload,
  ): Promise<void> {
    const serverKey = this.twentyConfigService.get('MIDTRANS_SERVER_KEY');

    // Verifikasi signature jika ada di payload
    if (isDefined(payload.signature_key)) {
      const isSignatureValid = verifyMidtransSignature(
        payload.order_id,
        payload.status_code,
        payload.gross_amount,
        serverKey,
        payload.signature_key,
      );

      if (!isSignatureValid) {
        throw new BillingException(
          `Signature notifikasi Midtrans tidak valid untuk orderId=${payload.order_id}`,
          BillingExceptionCode.BILLING_MIDTRANS_SIGNATURE_INVALID,
        );
      }
    }

    // Verifikasi status ke Midtrans — jangan percaya payload mentah
    let statusDariMidtrans: MidtransTransactionStatus;

    try {
      statusDariMidtrans =
        await this.midtransTransactionService.getTransactionStatus(
          payload.order_id,
        );
    } catch (error) {
      this.logger.error(
        `Gagal memverifikasi status transaksi ke Midtrans: orderId=${payload.order_id}`,
        error,
      );
      throw new BillingException(
        `Gagal memverifikasi transaksi ke Midtrans: ${payload.order_id}`,
        BillingExceptionCode.BILLING_UNHANDLED_ERROR,
      );
    }

    // Perbarui database
    const transaksi = await this.midtransTransactionService.updateTransactionStatus(
      payload.order_id,
      statusDariMidtrans,
      payload as Record<string, unknown>,
    );

    // Ambil aksi finansial hanya jika status settlement/capture
    const isSettled = MIDTRANS_SUCCESS_STATUSES.includes(
      statusDariMidtrans.transaction_status as (typeof MIDTRANS_SUCCESS_STATUSES)[number],
    );

    if (!isSettled) {
      this.logger.log(
        `Notifikasi diterima, status bukan settlement: orderId=${payload.order_id}, status=${statusDariMidtrans.transaction_status}`,
      );

      return;
    }

    if (transaksi.transactionType === 'TOP_UP_CREDIT') {
      await this.handleTopUpCredit(transaksi);
    } else if (transaksi.transactionType === 'MONTHLY_BILLING') {
      await this.handleMonthlyBilling(transaksi);
    }
  }

  /**
   * Menambah saldo kredit workspace setelah top up berhasil.
   */
  private async handleTopUpCredit(
    transaksi: BillingMidtransTransactionEntity,
  ): Promise<void> {
    const pelanggan = await this.billingCustomerRepository.findOne({
      where: { workspaceId: transaksi.workspaceId },
    });

    if (!isDefined(pelanggan)) {
      throw new BillingException(
        `Data pelanggan tidak ditemukan untuk workspace=${transaksi.workspaceId}`,
        BillingExceptionCode.BILLING_CUSTOMER_NOT_FOUND,
      );
    }

    // Konversi IDR ke micro-credit: 1 IDR = 1 micro-credit (dapat disesuaikan)
    const tambahanKredit = transaksi.grossAmount;

    pelanggan.creditBalanceMicro =
      (pelanggan.creditBalanceMicro ?? 0) + tambahanKredit;

    await this.billingCustomerRepository.save(pelanggan);

    this.logger.log(
      `Kredit berhasil ditambahkan: workspace=${transaksi.workspaceId}, tambahan=${tambahanKredit}, total=${pelanggan.creditBalanceMicro}`,
    );
  }

  /**
   * Memperbarui status subscription setelah tagihan bulanan berhasil dibayar.
   */
  private async handleMonthlyBilling(
    transaksi: BillingMidtransTransactionEntity,
  ): Promise<void> {
    const subscription = await this.billingSubscriptionRepository.findOne({
      where: { workspaceId: transaksi.workspaceId },
    });

    if (!isDefined(subscription)) {
      this.logger.warn(
        `Subscription tidak ditemukan untuk workspace=${transaksi.workspaceId} pada tagihan bulanan`,
      );

      return;
    }

    // Perpanjang period subscription 30 hari ke depan
    const sekarang = new Date();
    const periodeBerikutnya = new Date(sekarang);

    periodeBerikutnya.setDate(periodeBerikutnya.getDate() + 30);

    subscription.currentPeriodStart = sekarang;
    subscription.currentPeriodEnd = periodeBerikutnya;

    await this.billingSubscriptionRepository.save(subscription);

    this.logger.log(
      `Subscription diperbarui setelah tagihan bulanan: workspace=${transaksi.workspaceId}, periode hingga=${periodeBerikutnya.toISOString()}`,
    );
  }

  /**
   * Memverifikasi signature Midtrans — endpoint publik untuk testing.
   * Hanya untuk keperluan internal/debugging.
   */
  verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    receivedSignature: string,
  ): boolean {
    const serverKey = this.twentyConfigService.get('MIDTRANS_SERVER_KEY');

    return verifyMidtransSignature(
      orderId,
      statusCode,
      grossAmount,
      serverKey,
      receivedSignature,
    );
  }

  /**
   * Menghitung signature yang benar — hanya untuk keperluan internal/testing.
   */
  computeExpectedSignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
  ): string {
    const serverKey = this.twentyConfigService.get('MIDTRANS_SERVER_KEY');

    return computeMidtransSignature(orderId, statusCode, grossAmount, serverKey);
  }
}
