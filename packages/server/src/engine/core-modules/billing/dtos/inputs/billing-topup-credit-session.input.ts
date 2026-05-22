/* @license Enterprise */

import { ArgsType, Field, Int } from '@nestjs/graphql';

import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

/**
 * Input untuk membuat sesi top up kredit via Midtrans Snap.
 */
@ArgsType()
export class BillingTopUpCreditSessionInput {
  /**
   * Jumlah kredit yang akan dibeli dalam IDR (Rupiah, bilangan bulat).
   * Contoh: 100000 = Rp 100.000
   */
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  grossAmount: number;

  /**
   * Nama paket/item yang ditampilkan di halaman pembayaran Midtrans.
   * Contoh: "Top Up Kredit Bades 100.000 poin"
   */
  @Field(() => String)
  @IsString()
  itemName: string;

  /**
   * URL redirect setelah pembayaran selesai (opsional).
   * Jika tidak diisi, Midtrans akan menggunakan URL default.
   */
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  callbackFinishUrl?: string;
}
