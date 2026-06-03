import { Injectable } from '@nestjs/common';

import { isDefined } from 'shared/utils';

import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/services/field-metadata.service';
import { UpdateOneObjectInput } from 'src/engine/metadata-modules/object-metadata/dtos/update-object.input';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import {
  SEED_SUKAMAJU_WORKSPACE_ID,
  SEED_MEKARSARI_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { ASET_DESA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/aset-desa-custom-field-seeds.constant';
import { JABATAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/jabatan-custom-field-seeds.constant';
import { KELUARGA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/keluarga-custom-field-seeds.constant';
import { PENDUDUK_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/penduduk-custom-field-seeds.constant';
import { PENERIMA_BANTUAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/penerima-bantuan-custom-field-seeds.constant';
import { PERMOHONAN_SURAT_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/permohonan-surat-custom-field-seeds.constant';
import { PROGRAM_BANTUAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/program-bantuan-custom-field-seeds.constant';
import { SURAT_KELUAR_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/surat-keluar-custom-field-seeds.constant';
import { WILAYAH_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/wilayah-custom-field-seeds.constant';
import { ASET_DESA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/aset-desa-custom-object-seed.constant';
import { JABATAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/jabatan-custom-object-seed.constant';
import { KELUARGA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/keluarga-custom-object-seed.constant';
import { PENDUDUK_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/penduduk-custom-object-seed.constant';
import { PENERIMA_BANTUAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/penerima-bantuan-custom-object-seed.constant';
import { PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/permohonan-surat-custom-object-seed.constant';
import { PROGRAM_BANTUAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/program-bantuan-custom-object-seed.constant';
import { SURAT_KELUAR_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/surat-keluar-custom-object-seed.constant';
import { WILAYAH_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/wilayah-custom-object-seed.constant';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';
import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/object-metadata-seed.type';

type WorkspaceSeedConfig = {
  objects: { seed: ObjectMetadataSeed; fields?: FieldMetadataSeed[] }[];
};

@Injectable()
export class DevSeederMetadataService {
  constructor(
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fieldMetadataService: FieldMetadataService,
  ) {}

  private readonly workspaceConfigs: Record<string, WorkspaceSeedConfig> = {
    [SEED_SUKAMAJU_WORKSPACE_ID]: {
      objects: [
        // Bades SID Standard Seed — 9 object inti sesuai GOAL.md
        {
          seed: WILAYAH_CUSTOM_OBJECT_SEED,
          fields: WILAYAH_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: PENDUDUK_CUSTOM_OBJECT_SEED,
          fields: PENDUDUK_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: KELUARGA_CUSTOM_OBJECT_SEED,
          fields: KELUARGA_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED,
          fields: PERMOHONAN_SURAT_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: SURAT_KELUAR_CUSTOM_OBJECT_SEED,
          fields: SURAT_KELUAR_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: JABATAN_CUSTOM_OBJECT_SEED,
          fields: JABATAN_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: PROGRAM_BANTUAN_CUSTOM_OBJECT_SEED,
          fields: PROGRAM_BANTUAN_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: PENERIMA_BANTUAN_CUSTOM_OBJECT_SEED,
          fields: PENERIMA_BANTUAN_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: ASET_DESA_CUSTOM_OBJECT_SEED,
          fields: ASET_DESA_CUSTOM_FIELD_SEEDS,
        },
      ],
    },
    [SEED_MEKARSARI_WORKSPACE_ID]: {
      objects: [
        // Workspace kedua: subset minimal untuk demo lintas-workspace
        {
          seed: PENDUDUK_CUSTOM_OBJECT_SEED,
          fields: PENDUDUK_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: KELUARGA_CUSTOM_OBJECT_SEED,
          fields: KELUARGA_CUSTOM_FIELD_SEEDS,
        },
        {
          seed: PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED,
          fields: PERMOHONAN_SURAT_CUSTOM_FIELD_SEEDS,
        },
      ],
    },
  };

  private getLightConfig(_config: WorkspaceSeedConfig): WorkspaceSeedConfig {
    return {
      objects: [],
    };
  }

  private getConfig(workspaceId: string, light: boolean): WorkspaceSeedConfig {
    const config = this.workspaceConfigs[workspaceId];

    if (!config) {
      throw new Error(
        `Workspace configuration not found for workspaceId: ${workspaceId}`,
      );
    }

    return light ? this.getLightConfig(config) : config;
  }

  public async seed({
    workspaceId,
    light = false,
  }: {
    workspaceId: string;
    light?: boolean;
  }) {
    const config = this.getConfig(workspaceId, light);

    for (const obj of config.objects) {
      await this.seedCustomObject({
        workspaceId,
        objectMetadataSeed: obj.seed,
      });

      if (obj.fields) {
        await this.seedCustomFields({
          workspaceId,
          objectMetadataNameSingular: obj.seed.nameSingular,
          fieldMetadataSeeds: obj.fields,
        });
      }

      if (obj.seed.labelIdentifierFieldName) {
        await this.applyLabelIdentifier({
          workspaceId,
          objectMetadataNameSingular: obj.seed.nameSingular,
          labelIdentifierFieldName: obj.seed.labelIdentifierFieldName,
        });
      }
    }
  }

  /**
   * Setelah object dan fields di-seed, set labelIdentifierFieldMetadataId ke
   * field dengan nama `labelIdentifierFieldName`. Dipanggil hanya jika
   * ObjectMetadataSeed mendefinisikan `labelIdentifierFieldName`.
   */
  private async applyLabelIdentifier({
    workspaceId,
    objectMetadataNameSingular,
    labelIdentifierFieldName,
  }: {
    workspaceId: string;
    objectMetadataNameSingular: string;
    labelIdentifierFieldName: string;
  }): Promise<void> {
    const objectMetadata =
      await this.objectMetadataService.findOneWithinWorkspace(workspaceId, {
        where: { nameSingular: objectMetadataNameSingular },
        relations: ['fields'],
      });

    if (!isDefined(objectMetadata)) {
      throw new Error(
        `applyLabelIdentifier: object tidak ditemukan: ${objectMetadataNameSingular}`,
      );
    }

    const targetField = objectMetadata.fields?.find(
      (f) => f.name === labelIdentifierFieldName,
    );

    if (!isDefined(targetField)) {
      throw new Error(
        `applyLabelIdentifier: field tidak ditemukan: ${objectMetadataNameSingular}.${labelIdentifierFieldName}`,
      );
    }

    const updateInput: UpdateOneObjectInput = {
      id: objectMetadata.id,
      update: { labelIdentifierFieldMetadataId: targetField.id },
    };

    await this.objectMetadataService.updateOneObject({
      updateObjectInput: updateInput,
      workspaceId,
    });
  }

  private async seedCustomObject({
    workspaceId,
    objectMetadataSeed,
  }: {
    workspaceId: string;
    objectMetadataSeed: ObjectMetadataSeed;
  }): Promise<void> {
    await this.objectMetadataService.createOneObject({
      createObjectInput: objectMetadataSeed,
      workspaceId,
    });
  }

  private async seedCustomFields({
    workspaceId,
    objectMetadataNameSingular,
    fieldMetadataSeeds,
  }: {
    workspaceId: string;
    objectMetadataNameSingular: string;
    fieldMetadataSeeds: FieldMetadataSeed[];
  }): Promise<void> {
    const objectMetadata =
      await this.objectMetadataService.findOneWithinWorkspace(workspaceId, {
        where: { nameSingular: objectMetadataNameSingular },
      });

    if (!isDefined(objectMetadata)) {
      throw new Error(
        `Object metadata not found for: ${objectMetadataNameSingular}`,
      );
    }
    const createFieldInputs = fieldMetadataSeeds.map((fieldMetadataSeed) => ({
      ...fieldMetadataSeed,
      objectMetadataId: objectMetadata.id,
    }));

    await this.fieldMetadataService.createManyFields({
      createFieldInputs,
      workspaceId,
    });
  }
}
