import { type MigrationInterface, type QueryRunner } from 'typeorm';

/**
 * Migrasi: Tambah tabel billingMidtransTransaction dan kolom Midtrans
 * ke billingCustomer.
 *
 * Perubahan:
 * - Buat tabel `billingMidtransTransaction` untuk pencatatan transaksi Midtrans
 * - Tambah kolom `midtransCustomerRef` di `billingCustomer`
 * - Ubah `stripeCustomerId` di `billingCustomer` menjadi nullable
 *   (untuk mendukung pelanggan Midtrans-only)
 */
export class AddMidtransBilling1779389500000 implements MigrationInterface {
  name = 'AddMidtransBilling1779389500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Buat tabel billingMidtransTransaction
    await queryRunner.query(
      `CREATE TABLE "core"."billingMidtransTransaction" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "workspaceId" uuid NOT NULL,
        "orderId" character varying NOT NULL,
        "transactionType" character varying NOT NULL,
        "grossAmount" integer NOT NULL,
        "transactionStatus" character varying NOT NULL DEFAULT 'pending',
        "paymentType" character varying,
        "snapToken" character varying,
        "snapRedirectUrl" character varying,
        "midtransTransactionId" character varying,
        "rawNotification" jsonb,
        CONSTRAINT "IDX_BILLING_MIDTRANS_ORDER_ID_UNIQUE" UNIQUE ("orderId"),
        CONSTRAINT "PK_billingMidtransTransaction" PRIMARY KEY ("id")
      )`,
    );

    // Tambah kolom midtransCustomerRef ke billingCustomer
    await queryRunner.query(
      `ALTER TABLE "core"."billingCustomer"
       ADD COLUMN IF NOT EXISTS "midtransCustomerRef" character varying`,
    );

    // Ubah stripeCustomerId menjadi nullable
    // (NULL tidak dianggap duplikat oleh constraint UNIQUE di Postgres)
    await queryRunner.query(
      `ALTER TABLE "core"."billingCustomer"
       ALTER COLUMN "stripeCustomerId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Kembalikan stripeCustomerId ke NOT NULL
    await queryRunner.query(
      `ALTER TABLE "core"."billingCustomer"
       ALTER COLUMN "stripeCustomerId" SET NOT NULL`,
    );

    // Hapus kolom midtransCustomerRef
    await queryRunner.query(
      `ALTER TABLE "core"."billingCustomer"
       DROP COLUMN IF EXISTS "midtransCustomerRef"`,
    );

    // Hapus tabel billingMidtransTransaction
    await queryRunner.query(
      `DROP TABLE IF EXISTS "core"."billingMidtransTransaction"`,
    );
  }
}
