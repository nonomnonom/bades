import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddAiAgentWorkspaceSettings1776000000000
  implements MigrationInterface
{
  name = 'AddAiAgentWorkspaceSettings1776000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" ADD "aiWriteConfirmationMode" character varying NOT NULL DEFAULT 'destructive'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" DROP COLUMN "aiWriteConfirmationMode"`,
    );
  }
}
