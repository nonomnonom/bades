import { type MigrationInterface, type QueryRunner } from 'typeorm';

/**
 * Migrasi: Rebuild skema billing untuk Midtrans-first.
 *
 * Perubahan:
 * - billingSubscription: tambah billingCustomerId (UUID FK), tambah planKey (enum)
 * - billingSubscription: hapus stripeCustomerId, stripeSubscriptionId, metadata, automaticTax, cancellationDetails
 * - billingProduct: ganti nama stripeProductId → productCode (unique), tambah defaultPriceId, hapus defaultStripePriceId
 * - billingPrice: ganti nama stripeProductId → productCode (FK), hapus stripeMeterId
 * - billingSubscriptionItem: ganti nama stripeProductId → productCode, hapus stripeSubscriptionId, stripeSubscriptionItemId, billingThresholds
 * - billingSubscriptionItem: perbarui constraint unique ke (billingSubscriptionId, productCode)
 * - billingEntitlement: ganti FK join dari stripeCustomerId → billingCustomerId (UUID FK ke billingCustomer.id)
 * - billingCustomer: stripeCustomerId tetap ada (nullable) untuk kompatibilitas data lama
 * - hapus tabel billingMeter jika masih ada
 */
export class RebuildBillingForMidtrans1780000000000 implements MigrationInterface {
  name = 'RebuildBillingForMidtrans1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =====================================================================
    // 1. billingSubscription — tambah kolom baru
    // =====================================================================
    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscription"
        ADD COLUMN IF NOT EXISTS "billingCustomerId" uuid,
        ADD COLUMN IF NOT EXISTS "planKey" text
    `);

    // Isi billingCustomerId dari join ke billingCustomer via stripeCustomerId (migrasi data lama)
    await queryRunner.query(`
      UPDATE "core"."billingSubscription" sub
      SET "billingCustomerId" = cust.id
      FROM "core"."billingCustomer" cust
      WHERE sub."stripeCustomerId" IS NOT NULL
        AND sub."stripeCustomerId" = cust."stripeCustomerId"
        AND sub."billingCustomerId" IS NULL
    `);

    // FK constraint ke billingCustomer.id (idempoten: drop dulu baru add)
    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscription"
        DROP CONSTRAINT IF EXISTS "FK_billingSubscription_billingCustomerId"
    `);
    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscription"
        ADD CONSTRAINT "FK_billingSubscription_billingCustomerId"
        FOREIGN KEY ("billingCustomerId")
        REFERENCES "core"."billingCustomer"("id")
        ON DELETE SET NULL ON UPDATE CASCADE
    `);

    // Hapus kolom Stripe dari billingSubscription
    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscription"
        DROP COLUMN IF EXISTS "stripeCustomerId",
        DROP COLUMN IF EXISTS "stripeSubscriptionId",
        DROP COLUMN IF EXISTS "metadata",
        DROP COLUMN IF EXISTS "automaticTax",
        DROP COLUMN IF EXISTS "cancellationDetails"
    `);

    // =====================================================================
    // 2. billingProduct — ganti stripeProductId → productCode
    // =====================================================================
    await queryRunner.query(`
      ALTER TABLE "core"."billingProduct"
        ADD COLUMN IF NOT EXISTS "productCode" text,
        ADD COLUMN IF NOT EXISTS "defaultPriceId" text
    `);

    // Salin data lama
    await queryRunner.query(`
      UPDATE "core"."billingProduct"
      SET "productCode" = "stripeProductId"
      WHERE "productCode" IS NULL AND "stripeProductId" IS NOT NULL
    `);

    await queryRunner.query(`
      UPDATE "core"."billingProduct"
      SET "defaultPriceId" = "defaultStripePriceId"
      WHERE "defaultPriceId" IS NULL AND "defaultStripePriceId" IS NOT NULL
    `);

    // Unique index baru pada productCode
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_billingProduct_productCode"
      ON "core"."billingProduct"("productCode")
      WHERE "productCode" IS NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "core"."billingProduct"
        DROP COLUMN IF EXISTS "stripeProductId",
        DROP COLUMN IF EXISTS "defaultStripePriceId"
    `);

    // =====================================================================
    // 3. billingPrice — ganti stripeProductId → productCode, hapus stripeMeterId
    // =====================================================================
    await queryRunner.query(`
      ALTER TABLE "core"."billingPrice"
        ADD COLUMN IF NOT EXISTS "productCode" text
    `);

    await queryRunner.query(`
      UPDATE "core"."billingPrice"
      SET "productCode" = "stripeProductId"
      WHERE "productCode" IS NULL AND "stripeProductId" IS NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "core"."billingPrice"
        DROP COLUMN IF EXISTS "stripeProductId",
        DROP COLUMN IF EXISTS "stripeMeterId"
    `);

    // =====================================================================
    // 4. billingSubscriptionItem — ganti stripeProductId → productCode
    // =====================================================================
    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscriptionItem"
        ADD COLUMN IF NOT EXISTS "productCode" text
    `);

    await queryRunner.query(`
      UPDATE "core"."billingSubscriptionItem"
      SET "productCode" = "stripeProductId"
      WHERE "productCode" IS NULL AND "stripeProductId" IS NOT NULL
    `);

    // Hapus constraint unique lama jika ada
    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscriptionItem"
        DROP CONSTRAINT IF EXISTS "IDX_BILLING_SUBSCRIPTION_ITEM_STRIPE_SUBSCRIPTION_ITEM_ID_UNIQUE",
        DROP CONSTRAINT IF EXISTS "UQ_billingSubscriptionItem_stripeSubscriptionItemId"
    `);

    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscriptionItem"
        DROP COLUMN IF EXISTS "stripeSubscriptionId",
        DROP COLUMN IF EXISTS "stripeSubscriptionItemId",
        DROP COLUMN IF EXISTS "stripeProductId",
        DROP COLUMN IF EXISTS "billingThresholds"
    `);

    // Tambah unique constraint baru (billingSubscriptionId, productCode)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_billingSubscriptionItem_sub_product"
      ON "core"."billingSubscriptionItem"("billingSubscriptionId", "productCode")
      WHERE "productCode" IS NOT NULL
    `);

    // =====================================================================
    // 5. billingEntitlement — migrasi FK dari stripeCustomerId → billingCustomerId
    // =====================================================================
    await queryRunner.query(`
      ALTER TABLE "core"."billingEntitlement"
        ADD COLUMN IF NOT EXISTS "billingCustomerId" uuid
    `);

    // Isi dari join ke billingCustomer via stripeCustomerId
    await queryRunner.query(`
      UPDATE "core"."billingEntitlement" ent
      SET "billingCustomerId" = cust.id
      FROM "core"."billingCustomer" cust
      WHERE ent."stripeCustomerId" = cust."stripeCustomerId"
        AND ent."billingCustomerId" IS NULL
    `);

    // Hapus FK lama (stripeCustomerId → billingCustomer.stripeCustomerId)
    await queryRunner.query(`
      ALTER TABLE "core"."billingEntitlement"
        DROP CONSTRAINT IF EXISTS "FK_766a1918aa3dbe0d67d3df62356",
        DROP CONSTRAINT IF EXISTS "FK_billingEntitlement_stripeCustomerId"
    `);

    // Tambah FK baru ke billingCustomer.id (idempoten: drop dulu baru add)
    await queryRunner.query(`
      ALTER TABLE "core"."billingEntitlement"
        DROP CONSTRAINT IF EXISTS "FK_billingEntitlement_billingCustomerId"
    `);
    await queryRunner.query(`
      ALTER TABLE "core"."billingEntitlement"
        ADD CONSTRAINT "FK_billingEntitlement_billingCustomerId"
        FOREIGN KEY ("billingCustomerId")
        REFERENCES "core"."billingCustomer"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "core"."billingEntitlement"
        DROP COLUMN IF EXISTS "stripeCustomerId"
    `);

    // =====================================================================
    // 6. billingMeter — hapus tabel jika masih ada
    // =====================================================================
    await queryRunner.query(`
      DROP TABLE IF EXISTS "core"."billingMeter"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Down migration: kembalikan kolom Stripe — hanya untuk rollback darurat,
    // data stripeCustomerId / stripeSubscriptionId tidak bisa dipulihkan otomatis.

    // billingEntitlement — kembalikan stripeCustomerId
    await queryRunner.query(`
      ALTER TABLE "core"."billingEntitlement"
        DROP CONSTRAINT IF EXISTS "FK_billingEntitlement_billingCustomerId",
        DROP COLUMN IF EXISTS "billingCustomerId"
    `);

    // billingSubscription — kembalikan kolom Stripe
    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscription"
        DROP CONSTRAINT IF EXISTS "FK_billingSubscription_billingCustomerId",
        DROP COLUMN IF EXISTS "billingCustomerId",
        DROP COLUMN IF EXISTS "planKey"
    `);

    // billingProduct — kembalikan stripeProductId
    await queryRunner.query(`
      DROP INDEX IF EXISTS "core"."IDX_billingProduct_productCode"
    `);
    await queryRunner.query(`
      ALTER TABLE "core"."billingProduct"
        DROP COLUMN IF EXISTS "productCode",
        DROP COLUMN IF EXISTS "defaultPriceId"
    `);

    // billingPrice — kembalikan stripeProductId
    await queryRunner.query(`
      ALTER TABLE "core"."billingPrice"
        DROP COLUMN IF EXISTS "productCode"
    `);

    // billingSubscriptionItem — kembalikan kolom lama
    await queryRunner.query(`
      DROP INDEX IF EXISTS "core"."IDX_billingSubscriptionItem_sub_product"
    `);
    await queryRunner.query(`
      ALTER TABLE "core"."billingSubscriptionItem"
        DROP COLUMN IF EXISTS "productCode"
    `);
  }
}
