import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddMapViewType1774000000001 implements MigrationInterface {
  name = 'AddMapViewType1774000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "core"."view_type_enum" ADD VALUE IF NOT EXISTS 'MAP' AFTER 'TABLE_WIDGET'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Hapus baris view yang sudah memakai MAP sebelum enum diturunkan —
    // ALTER COLUMN TYPE akan gagal bila ada nilai yang tidak ada di enum baru.
    await queryRunner.query(`DELETE FROM "core"."view" WHERE "type" = 'MAP'`);

    // Defensive: bersihkan enum old jika masih ada dari run sebelumnya.
    await queryRunner.query(`DROP TYPE IF EXISTS "core"."view_type_enum_old"`);

    // Enum baru TANPA 'MAP' untuk mengembalikan ke kondisi pra-up().
    await queryRunner.query(
      `CREATE TYPE "core"."view_type_enum_old" AS ENUM('TABLE', 'KANBAN', 'CALENDAR', 'FIELDS_WIDGET', 'TABLE_WIDGET')`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."view" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."view" ALTER COLUMN "type" TYPE "core"."view_type_enum_old" USING "type"::"text"::"core"."view_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."view" ALTER COLUMN "type" SET DEFAULT 'TABLE'`,
    );
    await queryRunner.query(`DROP TYPE "core"."view_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "core"."view_type_enum_old" RENAME TO "view_type_enum"`,
    );
  }
}
