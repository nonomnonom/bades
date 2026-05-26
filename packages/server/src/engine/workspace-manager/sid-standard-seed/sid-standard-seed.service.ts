import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'shared/utils';

import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/services/field-metadata.service';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { SID_STANDARD_OBJECT_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.config';

// Seed 23 objek SID standar Bades (Penduduk, Keluarga, Wilayah, Lembaga
// Desa, Surat, Anggaran, Bantuan, Aset, dst) ke setiap workspace.
//
// Berbeda dari `DevSeederMetadataService` yang dipakai untuk workspace dev
// `sukamaju`/`mekarsari`, service ini:
//   - tidak hardcode workspace ID,
//   - idempotent (skip object/field yang sudah ada),
//   - aman dipanggil dari workspace creation flow dan upgrade command.
@Injectable()
export class SidStandardSeedService {
  private readonly logger = new Logger(SidStandardSeedService.name);

  constructor(
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fieldMetadataService: FieldMetadataService,
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
}
