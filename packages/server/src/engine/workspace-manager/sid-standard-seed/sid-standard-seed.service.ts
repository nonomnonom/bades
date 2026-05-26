import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { isDefined } from 'shared/utils';

import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/services/field-metadata.service';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { SID_STANDARD_DATA_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed-data.constant';
import { SID_STANDARD_OBJECT_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.config';

// Seed 9 objek SID standar Bades (Penduduk, Keluarga, Wilayah, Layanan,
// Surat, Perangkat Desa, Program Bantuan, Penerima Bantuan, Aset Desa) +
// sample record minimal ke setiap workspace baru.
//
// Berbeda dari `DevSeederMetadataService` yang dipakai untuk workspace dev
// `sukamaju`/`mekarsari`, service ini:
//   - tidak hardcode workspace ID,
//   - idempotent (skip object/field/record yang sudah ada),
//   - aman dipanggil dari workspace creation flow dan upgrade command.
@Injectable()
export class SidStandardSeedService {
  private readonly logger = new Logger(SidStandardSeedService.name);

  constructor(
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fieldMetadataService: FieldMetadataService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {}

  async seedSidStandardObjects({
    workspaceId,
  }: {
    workspaceId: string;
  }): Promise<{ createdObjects: number; createdFields: number }> {
    let createdObjects = 0;
    let createdFields = 0;

    for (const { object, fields } of SID_STANDARD_OBJECT_SEEDS) {
      const existing = await this.objectMetadataService.findOneWithinWorkspace(
        workspaceId,
        {
          where: { nameSingular: object.nameSingular },
        },
      );

      let objectMetadataId: string;

      if (isDefined(existing)) {
        this.logger.log(
          `Objek SID '${object.nameSingular}' sudah ada di workspace ${workspaceId} — skip create`,
        );
        objectMetadataId = existing.id;
      } else {
        const created = await this.objectMetadataService.createOneObject({
          createObjectInput: object,
          workspaceId,
        });
        objectMetadataId = created.id;
        createdObjects += 1;
        this.logger.log(
          `Objek SID '${object.nameSingular}' dibuat di workspace ${workspaceId}`,
        );
      }

      // Field metadata: createMany sudah idempotent untuk nama field yang
      // sama via unique constraint. Tapi kita tetap filter manual supaya
      // tidak spam error log.
      const existingFieldNames = new Set(
        existing?.fields?.map((field) => field.name) ?? [],
      );
      const fieldsToCreate = fields
        .filter((field) => !existingFieldNames.has(field.name))
        .map((field) => ({
          ...field,
          objectMetadataId,
        }));

      if (fieldsToCreate.length === 0) {
        continue;
      }

      try {
        await this.fieldMetadataService.createManyFields({
          createFieldInputs: fieldsToCreate,
          workspaceId,
        });
        createdFields += fieldsToCreate.length;
        this.logger.log(
          `${fieldsToCreate.length} field SID ditambahkan ke '${object.nameSingular}' (workspace ${workspaceId})`,
        );
      } catch (error) {
        // Beberapa field yang sudah ada akan throw — log lalu lanjut ke
        // object berikutnya, jangan rollback object yang sudah berhasil.
        this.logger.warn(
          `Gagal seed sebagian field untuk '${object.nameSingular}' di workspace ${workspaceId}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return { createdObjects, createdFields };
  }

  // Tanam sample record minimal ke schema workspace. Idempotent via
  // `ON CONFLICT (id) DO NOTHING` — aman dipanggil ulang.
  //
  // Catatan: dipanggil setelah `seedSidStandardObjects` dan setelah workspace
  // migration runner men-create table fisik di schema (`_penduduk`,
  // `_keluarga`, dst). Kalau dipanggil sebelum tabel ada, blok try/catch akan
  // log warn dan lanjut tanpa break workspace creation.
  async seedSidStandardData({
    workspaceId,
    schemaName,
  }: {
    workspaceId: string;
    schemaName: string;
  }): Promise<{ insertedRecords: number }> {
    let insertedRecords = 0;

    for (const { tableName, columns, rows } of SID_STANDARD_DATA_SEEDS) {
      if (rows.length === 0) {
        continue;
      }

      const quotedColumns = columns.map((c) => `"${c}"`).join(', ');
      const placeholderGroups: string[] = [];
      const params: unknown[] = [];
      let paramIndex = 1;

      for (const row of rows) {
        const rowPlaceholders: string[] = [];

        for (const col of columns) {
          rowPlaceholders.push(`$${paramIndex}`);
          params.push(row[col] ?? null);
          paramIndex += 1;
        }
        placeholderGroups.push(`(${rowPlaceholders.join(', ')})`);
      }

      const sql = `INSERT INTO "${schemaName}"."${tableName}" (${quotedColumns}) VALUES ${placeholderGroups.join(', ')} ON CONFLICT (id) DO NOTHING`;

      try {
        const result = await this.coreDataSource.query(sql, params);
        const affected = Array.isArray(result) ? result.length : rows.length;

        insertedRecords += affected;
        this.logger.log(
          `Seed ${affected} record contoh ke '${schemaName}.${tableName}' (workspace ${workspaceId})`,
        );
      } catch (error) {
        this.logger.warn(
          `Gagal seed data contoh ke '${schemaName}.${tableName}' (workspace ${workspaceId}): ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return { insertedRecords };
  }
}
