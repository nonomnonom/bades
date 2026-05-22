/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { isDefined } from 'shared/utils';

import type { Snap, SnapCreateTransactionParam } from 'midtrans-client';

import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import {
  BillingMidtransTransactionEntity,
  type MidtransTransactionType,
} from 'src/engine/core-modules/billing/entities/billing-midtrans-transaction.entity';
import { MidtransSDKService } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/services/midtrans-sdk.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

export type MidtransSnapResult = {
  snapToken: string;
  snapRedirectUrl: string;
  orderId: string;
};

/**
 * Layanan untuk membuat sesi pembayaran Midtrans Snap.
 * Satu integrasi Snap membuka semua metode pembayaran lokal Indonesia
 * (VA, QRIS, GoPay, OVO, dll.) dalam satu checkout surface.
 */
@Injectable()
export class MidtransSnapService {
  protected readonly logger = new Logger(MidtransSnapService.name);
  private snap: Snap;

  constructor(
    private readonly badesConfigService: BadesConfigService,
    private readonly midtransSDKService: MidtransSDKService,
    @InjectRepository(BillingMidtransTransactionEntity)
    private readonly midtransTransactionRepository: Repository<BillingMidtransTransactionEntity>,
  ) {
    if (!this.badesConfigService.get('IS_BILLING_ENABLED')) {
      return;
    }

    this.snap = this.midtransSDKService.getSnap(
      this.badesConfigService.get('MIDTRANS_SERVER_KEY'),
      this.badesConfigService.get('MIDTRANS_CLIENT_KEY'),
      this.badesConfigService.get('MIDTRANS_IS_PRODUCTION'),
    );
  }

  /**
   * Membuat transaksi Snap baru dan menyimpannya ke database.
   *
   * @param workspaceId       - UUID workspace Bades
   * @param grossAmount       - Jumlah dalam IDR (bilangan bulat)
   * @param transactionType   - Jenis transaksi: TOP_UP_CREDIT | MONTHLY_BILLING
   * @param customerEmail     - Email pelanggan (opsional, untuk customer_details)
   * @param itemName          - Nama item yang ditampilkan di halaman Snap
   * @param callbackFinishUrl - URL redirect setelah pembayaran selesai
   */
  async createSnapTransaction({
    workspaceId,
    grossAmount,
    transactionType,
    customerEmail,
    itemName,
    callbackFinishUrl,
  }: {
    workspaceId: string;
    grossAmount: number;
    transactionType: MidtransTransactionType;
    customerEmail?: string;
    itemName: string;
    callbackFinishUrl?: string;
  }): Promise<MidtransSnapResult> {
    if (!isDefined(this.snap)) {
      throw new BillingException(
        'Midtrans Snap tidak dikonfigurasi. Aktifkan IS_BILLING_ENABLED dan konfigurasi MIDTRANS_SERVER_KEY.',
        BillingExceptionCode.BILLING_PAYMENT_REQUIRED,
      );
    }

    // Format order_id unik: bades-{workspaceId}-{timestamp}
    const orderId = `bades-${workspaceId}-${Date.now()}`;

    const parameter: SnapCreateTransactionParam = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: [
        {
          id: transactionType,
          price: grossAmount,
          quantity: 1,
          name: itemName,
        },
      ],
      ...(isDefined(customerEmail)
        ? { customer_details: { email: customerEmail } }
        : {}),
      ...(isDefined(callbackFinishUrl)
        ? { callbacks: { finish: callbackFinishUrl } }
        : {}),
    };

    const snapResult = await this.snap.createTransaction(parameter);

    // Simpan transaksi ke database sebelum mengembalikan token
    await this.midtransTransactionRepository.save({
      workspaceId,
      orderId,
      transactionType,
      grossAmount,
      transactionStatus: 'pending',
      snapToken: snapResult.token,
      snapRedirectUrl: snapResult.redirect_url,
      paymentType: null,
      midtransTransactionId: null,
      rawNotification: null,
    });

    this.logger.log(
      `Transaksi Snap dibuat: orderId=${orderId}, tipe=${transactionType}, jumlah=${grossAmount} IDR`,
    );

    return {
      snapToken: snapResult.token,
      snapRedirectUrl: snapResult.redirect_url,
      orderId,
    };
  }
}
