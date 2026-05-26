import { type MigrationInterface, type QueryRunner } from 'typeorm';

/**
 * Migrasi: Set default currency `billingSubscription.currency` dari `USD`
 * (warisan migration awal 1708535112230) menjadi `IDR` (mata uang Bades
 * sebagai produk SaaS Indonesia via Midtrans).
 *
 * Lihat GOAL.md "Localization Defaults":
 *   - Currency: IDR
 *
 * Catatan:
 * - Entity `BillingSubscriptionEntity` sudah `default: 'IDR'` di kode TypeORM.
 *   Migration ini hanya menyelaraskan kolom DB lama yang sebelumnya memakai
 *   default `'USD'` agar workspace yang memakai migration historical tetap
 *   meng-insert dengan `IDR` ketika column tidak di-supply secara eksplisit.
 * - ALTER COLUMN SET DEFAULT aman: tidak mengubah data existing, hanya value
 *   default untuk INSERT baru.
 */
export class SetBillingSubscriptionCurrencyDefaultToIdr1780000100000
  implements MigrationInterface
{
  name = 'SetBillingSubscriptionCurrencyDefaultToIdr1780000100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."billingSubscription" ALTER COLUMN "currency" SET DEFAULT 'IDR'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."billingSubscription" ALTER COLUMN "currency" SET DEFAULT 'USD'`,
    );
  }
}
