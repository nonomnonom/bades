/* @license Enterprise */

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { WorkspaceRelatedEntity } from 'src/engine/workspace-manager/types/workspace-related-entity';

/**
 * Jenis transaksi Midtrans yang didukung Bades.
 */
export type MidtransTransactionType = 'TOP_UP_CREDIT' | 'MONTHLY_BILLING';

/**
 * Entitas pencatatan transaksi Midtrans — payment rail tunggal Bades.
 * Setiap baris mewakili satu sesi pembayaran (Snap) atau tagihan bulanan
 * yang diproses melalui Midtrans.
 *
 * `BillingCustomerEntity` punya kolom `legacyPaymentCustomerId` (kolom DB
 * historis `stripeCustomerId`) sebagai compat layer untuk pelanggan lama
 * yang belum di-backfill ke `midtransCustomerRef`.
 */
@Entity({ name: 'billingMidtransTransaction', schema: 'core' })
@Index('IDX_BILLING_MIDTRANS_ORDER_ID_UNIQUE', ['orderId'], { unique: true })
export class BillingMidtransTransactionEntity extends WorkspaceRelatedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /** UUID workspace Bades yang memiliki transaksi ini */
  @Column({ nullable: false, type: 'uuid' })
  workspaceId: string;

  /**
   * ID pesanan unik yang dikirim ke Midtrans.
   * Format yang direkomendasikan: `bades-{workspaceId}-{timestamp}`
   */
  @Column({ nullable: false, unique: true })
  orderId: string;

  /** Jenis transaksi: top up kredit atau tagihan bulanan */
  @Column({
    nullable: false,
    type: 'varchar',
  })
  transactionType: MidtransTransactionType;

  /**
   * Jumlah transaksi dalam Rupiah (IDR, bilangan bulat).
   * Midtrans tidak mendukung desimal untuk IDR.
   */
  @Column({ nullable: false, type: 'int' })
  grossAmount: number;

  /**
   * Status transaksi terakhir yang diketahui dari Midtrans.
   * Contoh: settlement, capture, pending, deny, expire, cancel, failure.
   */
  @Column({ nullable: false, default: 'pending' })
  transactionStatus: string;

  /** Metode pembayaran yang dipakai (bank_transfer, gopay, qris, dll.) */
  @Column({ nullable: true, type: 'varchar' })
  paymentType: string | null;

  /** Token Snap yang dikembalikan Midtrans saat pembuatan transaksi */
  @Column({ nullable: true, type: 'varchar' })
  snapToken: string | null;

  /** URL redirect Snap yang dikembalikan Midtrans */
  @Column({ nullable: true, type: 'varchar' })
  snapRedirectUrl: string | null;

  /** ID transaksi internal Midtrans (transaction_id dari respons API) */
  @Column({ nullable: true, type: 'varchar' })
  midtransTransactionId: string | null;

  /**
   * Payload notifikasi mentah dari Midtrans (JSONB).
   * Disimpan untuk keperluan audit dan debug.
   */
  @Column({ nullable: true, type: 'jsonb' })
  rawNotification: Record<string, unknown> | null;
}
