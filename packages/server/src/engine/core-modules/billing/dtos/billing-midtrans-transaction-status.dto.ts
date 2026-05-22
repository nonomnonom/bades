/* @license Enterprise */

import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * Status terkini sebuah transaksi pembayaran Midtrans.
 * Dipakai frontend untuk menampilkan hasil pembayaran setelah pengguna
 * kembali dari halaman Snap.
 */
@ObjectType('BillingMidtransTransactionStatus')
export class BillingMidtransTransactionStatusDTO {
  @Field(() => String)
  orderId: string;

  /** Jenis transaksi: TOP_UP_CREDIT atau MONTHLY_BILLING. */
  @Field(() => String)
  transactionType: string;

  /** Status Midtrans: settlement, capture, pending, deny, expire, cancel, dll. */
  @Field(() => String)
  transactionStatus: string;

  /** Nominal transaksi dalam IDR. */
  @Field(() => Int)
  grossAmount: number;

  /** Metode pembayaran yang dipakai, mis. bank_transfer, gopay, qris. */
  @Field(() => String, { nullable: true })
  paymentType?: string;
}
