import { type MigrationInterface, type QueryRunner } from 'typeorm';

// Bades: model AI dijalankan sebagai satu kapabilitas tunggal, jadi kolom
// toggle multi-model workspace dihapus dari schema.
export class DropAiModelAvailabilityColumns1776100000000 implements MigrationInterface {
  name = 'DropAiModelAvailabilityColumns1776100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" DROP COLUMN IF EXISTS "enabledAiModelIds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" DROP COLUMN IF EXISTS "useRecommendedModels"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" ADD "useRecommendedModels" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" ADD "enabledAiModelIds" character varying array NOT NULL DEFAULT '{}'`,
    );
  }
}
