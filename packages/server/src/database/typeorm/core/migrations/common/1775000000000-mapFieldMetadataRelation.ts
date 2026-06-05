import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class MapFieldMetadataRelation1775000000000
  implements MigrationInterface
{
  name = 'MapFieldMetadataRelation1775000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."view" ADD "mapFieldMetadataId" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VIEW_MAP_FIELD_METADATA" ON "core"."view" ("mapFieldMetadataId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."view" ADD CONSTRAINT "FK_view_map_field_metadata" FOREIGN KEY ("mapFieldMetadataId") REFERENCES "core"."fieldMetadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."view" DROP CONSTRAINT "FK_view_map_field_metadata"`,
    );
    await queryRunner.query(`DROP INDEX "core"."IDX_VIEW_MAP_FIELD_METADATA"`);
    await queryRunner.query(
      `ALTER TABLE "core"."view" DROP COLUMN "mapFieldMetadataId"`,
    );
  }
}
