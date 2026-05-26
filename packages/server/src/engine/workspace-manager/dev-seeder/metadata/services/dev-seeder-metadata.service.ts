import { Injectable } from '@nestjs/common';

import { FieldMetadataType, RelationType } from 'shared/types';
import { isDefined } from 'shared/utils';

import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/services/field-metadata.service';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { buildObjectIdByNameMaps } from 'src/engine/metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util';
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

type MorphRelationSeed = FieldMetadataSeed & {
  targetObjectMetadataNames: string[];
};

type JunctionFieldSeed = {
  sourceObjectName: string;
  name: string;
  label: string;
  icon: string;
  targetObjectName: string;
  targetFieldLabel: string;
  targetFieldIcon: string;
};

type JunctionConfigSeed = {
  objectName: string;
  fieldName: string;
  junctionTargetFieldRef: string;
  label?: string;
};

type WorkspaceSeedConfig = {
  objects: { seed: ObjectMetadataSeed; fields?: FieldMetadataSeed[] }[];
  fields: { objectName: string; seeds: FieldMetadataSeed[] }[];
  morphRelations?: { objectName: string; seeds: MorphRelationSeed[] }[];
  junctionFields?: JunctionFieldSeed[];
  junctionConfigs?: JunctionConfigSeed[];
};

type FlatMaps = {
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  objectIdByName: Record<string, string>;
};

@Injectable()
export class DevSeederMetadataService {
  constructor(
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fieldMetadataService: FieldMetadataService,
    private readonly flatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService,
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
      fields: [],
      morphRelations: [],
      junctionFields: [
        // Keluarga -> Penduduk (satu KK punya banyak anggota)
        {
          sourceObjectName: KELUARGA_CUSTOM_OBJECT_SEED.nameSingular,
          name: 'anggota',
          label: 'Anggota Keluarga',
          icon: 'IconUsers',
          targetObjectName: PENDUDUK_CUSTOM_OBJECT_SEED.nameSingular,
          targetFieldLabel: 'Kartu Keluarga',
          targetFieldIcon: 'IconHome',
        },
        // Penduduk -> Permohonan Surat (satu penduduk bisa punya banyak permohonan)
        {
          sourceObjectName: PENDUDUK_CUSTOM_OBJECT_SEED.nameSingular,
          name: 'permohonan',
          label: 'Permohonan Surat',
          icon: 'IconFileText',
          targetObjectName: PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED.nameSingular,
          targetFieldLabel: 'Pemohon',
          targetFieldIcon: 'IconUser',
        },
      ],
      junctionConfigs: [],
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
      fields: [],
    },
  };

  private getLightConfig(_config: WorkspaceSeedConfig): WorkspaceSeedConfig {
    return {
      objects: [],
      fields: [],
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
    }

    for (const fieldConfig of config.fields) {
      await this.seedCustomFields({
        workspaceId,
        objectMetadataNameSingular: fieldConfig.objectName,
        fieldMetadataSeeds: fieldConfig.seeds,
      });
    }
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

  public async seedRelations({
    workspaceId,
    light = false,
  }: {
    workspaceId: string;
    light?: boolean;
  }) {
    const config = this.getConfig(workspaceId, light);

    // 1. Seed morph relations (creates inverses on target objects)
    let maps = await this.getFreshFlatMaps(workspaceId);

    for (const relation of config.morphRelations ?? []) {
      await this.seedMorphRelations({
        workspaceId,
        relation,
        objectIdByNameSingular: maps.objectIdByName,
      });
    }

    // 2. Seed junction fields (creates relations + inverses on junction objects)
    maps = await this.getFreshFlatMaps(workspaceId);

    for (const field of config.junctionFields ?? []) {
      await this.seedJunctionField({ workspaceId, field, flatMaps: maps });
    }

    // 3. Configure junction settings (after all fields exist)
    if (config.junctionConfigs && config.junctionConfigs.length > 0) {
      maps = await this.getFreshFlatMaps(workspaceId);

      for (const junctionConfig of config.junctionConfigs) {
        await this.applyJunctionConfig({
          workspaceId,
          junctionConfig,
          flatMaps: maps,
        });
      }
    }
  }

  private async getFreshFlatMaps(workspaceId: string): Promise<FlatMaps> {
    await this.flatEntityMapsCacheService.invalidateFlatEntityMaps({
      workspaceId,
      flatMapsKeys: ['flatObjectMetadataMaps', 'flatFieldMetadataMaps'],
    });

    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps(
        {
          workspaceId,
          flatMapsKeys: ['flatObjectMetadataMaps', 'flatFieldMetadataMaps'],
        },
      );

    const { idByNameSingular } = buildObjectIdByNameMaps(
      flatObjectMetadataMaps,
    );

    return {
      flatFieldMetadataMaps,
      flatObjectMetadataMaps,
      objectIdByName: idByNameSingular,
    };
  }

  private async applyJunctionConfig({
    workspaceId,
    junctionConfig,
    flatMaps,
  }: {
    workspaceId: string;
    junctionConfig: JunctionConfigSeed;
    flatMaps: FlatMaps;
  }): Promise<void> {
    const [targetObjectName, targetFieldName] =
      junctionConfig.junctionTargetFieldRef.split('.');

    const junctionTargetFieldId = this.findFieldId(
      targetObjectName,
      targetFieldName,
      flatMaps,
    );

    const fieldId = this.findFieldId(
      junctionConfig.objectName,
      junctionConfig.fieldName,
      flatMaps,
    );

    await this.fieldMetadataService.updateOneField({
      workspaceId,
      updateFieldInput: {
        id: fieldId,
        ...(junctionConfig.label && { label: junctionConfig.label }),
        settings: {
          relationType: RelationType.ONE_TO_MANY,
          junctionTargetFieldId,
        },
      },
    });
  }

  private async seedMorphRelations({
    workspaceId,
    relation,
    objectIdByNameSingular,
  }: {
    workspaceId: string;
    relation: {
      objectName: string;
      seeds: MorphRelationSeed[];
    };
    objectIdByNameSingular: Record<string, string>;
  }): Promise<void> {
    const objectMetadataId = objectIdByNameSingular[relation.objectName];

    if (!isDefined(objectMetadataId)) {
      throw new Error(
        `Object metadata id not found for: ${relation.objectName}`,
      );
    }

    const createFieldInputs = relation.seeds.map((seed) => ({
      type: seed.type,
      label: seed.label,
      name: seed.name,
      icon: seed.icon,
      objectMetadataId,
      morphRelationsCreationPayload: seed.targetObjectMetadataNames.map(
        (targetObjectMetadataName) => {
          const targetObjectMetadataId =
            objectIdByNameSingular[targetObjectMetadataName];

          if (!isDefined(targetObjectMetadataId)) {
            throw new Error(
              `Target object metadata id not found for: ${targetObjectMetadataName}`,
            );
          }

          if (!isDefined(seed.morphRelationsCreationPayload)) {
            throw new Error('Payload pembuatan relasi morf tidak terdefinisi');
          }

          return {
            type: seed.morphRelationsCreationPayload[0].type,
            targetFieldLabel:
              seed.morphRelationsCreationPayload[0].targetFieldLabel,
            targetFieldIcon:
              seed.morphRelationsCreationPayload[0].targetFieldIcon,
            targetObjectMetadataId,
          };
        },
      ),
    }));

    await this.fieldMetadataService.createManyFields({
      createFieldInputs,
      workspaceId,
    });
  }

  private async seedJunctionField({
    workspaceId,
    field,
    flatMaps,
  }: {
    workspaceId: string;
    field: JunctionFieldSeed;
    flatMaps: FlatMaps;
  }): Promise<void> {
    const sourceObjectId = flatMaps.objectIdByName[field.sourceObjectName];
    const targetObjectId = flatMaps.objectIdByName[field.targetObjectName];

    if (!isDefined(sourceObjectId)) {
      throw new Error(
        `Objek sumber tidak ditemukan: ${field.sourceObjectName}`,
      );
    }
    if (!isDefined(targetObjectId)) {
      throw new Error(
        `Objek target tidak ditemukan: ${field.targetObjectName}`,
      );
    }

    await this.fieldMetadataService.createManyFields({
      createFieldInputs: [
        {
          type: FieldMetadataType.RELATION,
          name: field.name,
          label: field.label,
          icon: field.icon,
          objectMetadataId: sourceObjectId,
          relationCreationPayload: {
            type: RelationType.ONE_TO_MANY,
            targetFieldLabel: field.targetFieldLabel,
            targetFieldIcon: field.targetFieldIcon,
            targetObjectMetadataId: targetObjectId,
          },
        },
      ],
      workspaceId,
    });
  }

  private findFieldId(
    objectName: string,
    fieldName: string,
    flatMaps: FlatMaps,
  ): string {
    const objectId = flatMaps.objectIdByName[objectName];

    if (!isDefined(objectId)) {
      throw new Error(`Objek tidak ditemukan: ${objectName}`);
    }

    const objectMetadata = findFlatEntityByIdInFlatEntityMaps({
      flatEntityId: objectId,
      flatEntityMaps: flatMaps.flatObjectMetadataMaps,
    });

    if (!isDefined(objectMetadata)) {
      throw new Error(`Metadata objek tidak ditemukan: ${objectName}`);
    }

    for (const fieldId of objectMetadata.fieldIds) {
      const field = findFlatEntityByIdInFlatEntityMaps({
        flatEntityId: fieldId,
        flatEntityMaps: flatMaps.flatFieldMetadataMaps,
      });

      if (field?.name === fieldName) {
        return fieldId;
      }
    }

    throw new Error(`Field tidak ditemukan: ${objectName}.${fieldName}`);
  }
}
