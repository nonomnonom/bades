/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { isDefined } from 'shared/utils';

import type { CoreApi, MidtransTransactionStatus } from 'midtrans-client';

import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import { BillingMidtransTransactionEntity } from 'src/engine/core-modules/billing/entities/billing-midtrans-transaction.entity';
import { MidtransSDKService } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/services/midtrans-sdk.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

/**
 * Layanan untuk memverifikasi status transaksi Midtrans melalui GET Status API.
 * Verifikasi server-to-server wajib dilakukan sebelum mengambil aksi finansial —
 * jangan percaya payload callback mentah dari frontend.
 */
@Injectable()
export class MidtransTransactionService {
  protected readonly logger = new Logger(MidtransTransactionService.name);
  private coreApi: CoreApi;

  constructor(
    private readonly badesConfigService: BadesConfigService,
    private readonly midtransSDKService: MidtransSDKService,
    @InjectRepository(BillingMidtransTransactionEntity)
    private readonly midtransTransactionRepository: Repository<BillingMidtransTransactionEntity>,
  ) {
    if (!this.badesConfigService.get('IS_BILLING_ENABLED')) {
      return;
    }

    this.coreApi = this.midtransSDKService.getCoreApi(
      this.badesConfigService.get('MIDTRANS_SERVER_KEY'),
      this.badesConfigService.get('MIDTRANS_CLIENT_KEY'),
      this.badesConfigService.get('MIDTRANS_IS_PRODUCTION'),
    );
  }

  /**
   * Memverifikasi status transaksi langsung ke Midtrans (GET Status API).
   * Gunakan ini sebagai sumber kebenaran, bukan payload notifikasi mentah.
   *
   * @param orderId - ID pesanan yang dicari
   * @returns Status transaksi terkini dari Midtrans
   */
  async getTransactionStatus(
    orderId: string,
  ): Promise<MidtransTransactionStatus> {
    if (!isDefined(this.coreApi)) {
      throw new BillingException(
        'Midtrans CoreApi tidak dikonfigurasi.',
        BillingExceptionCode.BILLING_PAYMENT_REQUIRED,
      );
    }

    return await this.coreApi.transaction.status(orderId);
  }

  /**
   * Memperbarui status transaksi di database berdasarkan data dari Midtrans.
   *
   * @param orderId            - ID pesanan yang diperbarui
   * @param statusData         - Data status dari Midtrans API
   * @param rawNotification    - Payload notifikasi mentah (untuk audit)
   */
  async updateTransactionStatus(
    orderId: string,
    statusData: MidtransTransactionStatus,
    rawNotification?: Record<string, unknown>,
  ): Promise<BillingMidtransTransactionEntity> {
    const transaksi = await this.midtransTransactionRepository.findOne({
      where: { orderId },
    });

    if (!isDefined(transaksi)) {
      throw new BillingException(
        `Transaksi dengan orderId=${orderId} tidak ditemukan.`,
        BillingExceptionCode.BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND,
      );
    }

    transaksi.transactionStatus = statusData.transaction_status;
    transaksi.midtransTransactionId = statusData.transaction_id;

    if (isDefined(statusData.payment_type)) {
      transaksi.paymentType = statusData.payment_type;
    }

    if (isDefined(rawNotification)) {
      transaksi.rawNotification = rawNotification;
    }

    const updated = await this.midtransTransactionRepository.save(transaksi);

    this.logger.log(
      `Status transaksi diperbarui: orderId=${orderId}, status=${statusData.transaction_status}`,
    );

    return updated;
  }

  /**
   * Mencari transaksi berdasarkan orderId di database lokal.
   */
  async findByOrderId(
    orderId: string,
  ): Promise<BillingMidtransTransactionEntity | null> {
    return await this.midtransTransactionRepository.findOne({
      where: { orderId },
    });
  }
}
