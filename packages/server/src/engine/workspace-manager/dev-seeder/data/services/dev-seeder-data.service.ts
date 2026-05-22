import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { readFile } from 'fs/promises';
import { join } from 'path';

import { STANDARD_OBJECTS } from 'shared/metadata';
import { FeatureFlagKey, FileFolder } from 'shared/types';
import { DataSource } from 'typeorm';

import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { FileStorageService } from 'src/engine/core-modules/file-storage/file-storage.service';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { type WorkspaceEntityManager } from 'src/engine/sid-orm/entity-manager/workspace-entity-manager';
import { computeTableName } from 'src/engine/utils/compute-table-name.util';
// Seed SID-native saja. CRM seeds dihapus karena tidak relevan untuk konteks
// administrasi desa Indonesia. Seed warga, keluarga, surat, bantuan, anggaran,
// dan aset desa tetap berjalan normal.
import {
  DASHBOARD_DATA_SEED_COLUMNS,
  getDashboardDataSeeds,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/dashboard-data-seeds.constant';
import {
  PENDUDUK_DATA_SEED_COLUMNS,
  PENDUDUK_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/penduduk-data-seeds.constant';
import {
  KELUARGA_DATA_SEED_COLUMNS,
  KELUARGA_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/keluarga-data-seeds.constant';
import {
  JENIS_SURAT_DATA_SEED_COLUMNS,
  JENIS_SURAT_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/jenis-surat-data-seeds.constant';
import {
  PERMOHONAN_SURAT_DATA_SEED_COLUMNS,
  PERMOHONAN_SURAT_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/permohonan-surat-data-seeds.constant';
import {
  JABATAN_DATA_SEED_COLUMNS,
  JABATAN_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/jabatan-data-seeds.constant';
import {
  LEMBAGA_DESA_DATA_SEED_COLUMNS,
  LEMBAGA_DESA_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/lembaga-desa-data-seeds.constant';
import {
  ANGGARAN_DATA_SEED_COLUMNS,
  ANGGARAN_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/anggaran-data-seeds.constant';
import {
  REALISASI_ANGGARAN_DATA_SEED_COLUMNS,
  REALISASI_ANGGARAN_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/realisasi-anggaran-data-seeds.constant';
import {
  PROGRAM_BANTUAN_DATA_SEED_COLUMNS,
  PROGRAM_BANTUAN_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/program-bantuan-data-seeds.constant';
import {
  PENERIMA_BANTUAN_DATA_SEED_COLUMNS,
  PENERIMA_BANTUAN_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/penerima-bantuan-data-seeds.constant';
import {
  ASET_DESA_DATA_SEED_COLUMNS,
  ASET_DESA_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/aset-desa-data-seeds.constant';
import {
  UMKM_DATA_SEED_COLUMNS,
  UMKM_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/umkm-data-seeds.constant';
import {
  getWorkspaceMemberDataSeeds,
  WORKSPACE_MEMBER_DATA_SEED_COLUMNS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
import {
  ATTACHMENT_SAMPLE_FILES,
  type AttachmentFileSeedMetadata,
  generateAttachmentSeedsForWorkspace,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/attachment-data-seeds.constant';
import { TimelineActivitySeederService } from 'src/engine/workspace-manager/dev-seeder/data/services/timeline-activity-seeder.service';
import { prefillFrontComponentCommandMenuItems } from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-front-component-command-menu-items.util';
import { prefillWorkflowCommandMenuItems } from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-workflow-command-menu-items.util';
import { prefillWorkflows } from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-workflows.util';
import { BADES_STANDARD_APPLICATION } from 'src/engine/workspace-manager/twenty-standard-application/constants/twenty-standard-applications';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

type RecordSeedConfig = {
  tableName: string;
  pgColumns: string[];
  recordSeeds: Record<string, unknown>[];
};

// Organize seeds into dependency batches for parallel insertion
const getRecordSeedsBatches = (
  workspaceId: string,
  _featureFlags?: Record<FeatureFlagKey, boolean>,
): RecordSeedConfig[][] => {
  // Batch 1: No dependencies
  const batch1: RecordSeedConfig[] = [
    {
      tableName: 'workspaceMember',
      pgColumns: WORKSPACE_MEMBER_DATA_SEED_COLUMNS,
      recordSeeds: getWorkspaceMemberDataSeeds(workspaceId),
    },
  ];

  // Batch 2: Depends on workspaceMember
  const batch2: RecordSeedConfig[] = [
    {
      tableName: 'dashboard',
      pgColumns: DASHBOARD_DATA_SEED_COLUMNS,
      recordSeeds: getDashboardDataSeeds(workspaceId),
    },
  ];

  // Batch 3: SID entities - depends on workspaceMember
  const batch3: RecordSeedConfig[] = [
    {
      tableName: '_penduduk',
      pgColumns: PENDUDUK_DATA_SEED_COLUMNS,
      recordSeeds: PENDUDUK_DATA_SEEDS,
    },
    {
      tableName: '_keluarga',
      pgColumns: KELUARGA_DATA_SEED_COLUMNS,
      recordSeeds: KELUARGA_DATA_SEEDS,
    },
    {
      tableName: '_jenisSurat',
      pgColumns: JENIS_SURAT_DATA_SEED_COLUMNS,
      recordSeeds: JENIS_SURAT_DATA_SEEDS,
    },
  ];

  // Batch 4: SID entities - depends on batch 3 or independent
  const batch4: RecordSeedConfig[] = [
    {
      tableName: '_permohonanSurat',
      pgColumns: PERMOHONAN_SURAT_DATA_SEED_COLUMNS,
      recordSeeds: PERMOHONAN_SURAT_DATA_SEEDS,
    },
    {
      tableName: '_jabatan',
      pgColumns: JABATAN_DATA_SEED_COLUMNS,
      recordSeeds: JABATAN_DATA_SEEDS,
    },
    {
      tableName: '_lembagaDesa',
      pgColumns: LEMBAGA_DESA_DATA_SEED_COLUMNS,
      recordSeeds: LEMBAGA_DESA_DATA_SEEDS,
    },
    {
      tableName: '_anggaran',
      pgColumns: ANGGARAN_DATA_SEED_COLUMNS,
      recordSeeds: ANGGARAN_DATA_SEEDS,
    },
    {
      tableName: '_realisasiAnggaran',
      pgColumns: REALISASI_ANGGARAN_DATA_SEED_COLUMNS,
      recordSeeds: REALISASI_ANGGARAN_DATA_SEEDS,
    },
    {
      tableName: '_programBantuan',
      pgColumns: PROGRAM_BANTUAN_DATA_SEED_COLUMNS,
      recordSeeds: PROGRAM_BANTUAN_DATA_SEEDS,
    },
    {
      tableName: '_penerimaBantuan',
      pgColumns: PENERIMA_BANTUAN_DATA_SEED_COLUMNS,
      recordSeeds: PENERIMA_BANTUAN_DATA_SEEDS,
    },
    {
      tableName: '_asetDesa',
      pgColumns: ASET_DESA_DATA_SEED_COLUMNS,
      recordSeeds: ASET_DESA_DATA_SEEDS,
    },
    {
      tableName: '_umkm',
      pgColumns: UMKM_DATA_SEED_COLUMNS,
      recordSeeds: UMKM_DATA_SEEDS,
    },
  ];

  return [batch1, batch2, batch3, batch4];
};

@Injectable()
export class DevSeederDataService {
  constructor(
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly timelineActivitySeederService: TimelineActivitySeederService,
    private readonly fileStorageService: FileStorageService,
    private readonly flatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService,
    private readonly applicationService: ApplicationService,
    private readonly workspaceMigrationValidateBuildAndRunService: WorkspaceMigrationValidateBuildAndRunService,
  ) {}

  public async seed({
    schemaName,
    workspaceId,
    featureFlags,
    light = false,
  }: {
    schemaName: string;
    workspaceId: string;
    featureFlags?: Record<FeatureFlagKey, boolean>;
    light?: boolean;
  }) {
    const objectMetadataItems =
      await this.objectMetadataService.findManyWithinWorkspace(workspaceId);

    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps(
        {
          workspaceId,
          flatMapsKeys: ['flatObjectMetadataMaps', 'flatFieldMetadataMaps'],
        },
      );

    const { fileSeedMetadata: attachmentFileMeta } =
      generateAttachmentSeedsForWorkspace(workspaceId);

    await this.coreDataSource.transaction(
      async (entityManager: WorkspaceEntityManager) => {
        await this.seedRecordsInBatches({
          entityManager,
          schemaName,
          workspaceId,
          featureFlags,
          objectMetadataItems,
          light,
        });

        if (!light) {
          await this.timelineActivitySeederService.seedTimelineActivities({
            entityManager,
            schemaName,
            workspaceId,
          });

          await this.seedAttachmentFiles(
            workspaceId,
            entityManager,
            attachmentFileMeta,
          );
        }

        await prefillWorkflows(
          entityManager,
          workspaceId,
          schemaName,
          flatObjectMetadataMaps,
          flatFieldMetadataMaps,
        );
      },
    );

    await prefillWorkflowCommandMenuItems({
      workspaceId,
      applicationService: this.applicationService,
      flatEntityMapsCacheService: this.flatEntityMapsCacheService,
      workspaceMigrationValidateBuildAndRunService:
        this.workspaceMigrationValidateBuildAndRunService,
    });

    await prefillFrontComponentCommandMenuItems({
      workspaceId,
      applicationService: this.applicationService,
      flatEntityMapsCacheService: this.flatEntityMapsCacheService,
      workspaceMigrationValidateBuildAndRunService:
        this.workspaceMigrationValidateBuildAndRunService,
    });
  }

  private async seedRecordsInBatches({
    entityManager,
    schemaName,
    workspaceId,
    featureFlags,
    objectMetadataItems,
    light = false,
  }: {
    entityManager: WorkspaceEntityManager;
    schemaName: string;
    workspaceId: string;
    featureFlags?: Record<FeatureFlagKey, boolean>;
    objectMetadataItems: FlatObjectMetadata[];
    light?: boolean;
  }) {
    const batches = getRecordSeedsBatches(
      workspaceId,
      featureFlags,
    );

    // Process batches sequentially (respecting dependencies)
    // but entities within each batch in parallel
    for (const batch of batches) {
      await Promise.all(
        batch.map(async (recordSeedsConfig) => {
          if (light && recordSeedsConfig.tableName.startsWith('_')) {
            return;
          }

          const objectMetadata = objectMetadataItems.find(
            (item) =>
              computeTableName(item.nameSingular, item.isCustom) ===
              recordSeedsConfig.tableName,
          );

          if (!objectMetadata) {
            // TODO this continue is hacky, we should have a record seed config per workspace
            return;
          }

          await this.seedRecords({
            entityManager,
            schemaName,
            tableName: recordSeedsConfig.tableName,
            pgColumns: recordSeedsConfig.pgColumns,
            recordSeeds: recordSeedsConfig.recordSeeds,
          });
        }),
      );
    }
  }

  private async seedRecords({
    entityManager,
    schemaName,
    tableName,
    pgColumns,
    recordSeeds,
  }: {
    entityManager: WorkspaceEntityManager;
    schemaName: string;
    tableName: string;
    pgColumns: string[];
    recordSeeds: Record<string, unknown>[];
  }) {
    await entityManager
      .createQueryBuilder(undefined, undefined, undefined, {
        shouldBypassPermissionChecks: true,
      })
      .insert()
      .into(`${schemaName}.${tableName}`, pgColumns)
      .orIgnore()
      .values(recordSeeds)
      .execute();
  }

  private async seedAttachmentFiles(
    workspaceId: string,
    entityManager: WorkspaceEntityManager,
    fileSeedMetadata: AttachmentFileSeedMetadata[],
  ): Promise<void> {
    // Windows: __dirname uses backslashes, so check both variants
    const IS_BUILT =
      __dirname.includes('/dist/') || __dirname.includes('\\dist\\');
    const sampleFilesDir = IS_BUILT
      ? join(
          __dirname,
          '../../../../../assets/engine/workspace-manager/dev-seeder/data/sample-files',
        )
      : join(__dirname, '../sample-files');

    // Read each sample file once and cache the buffer
    const sampleFileBuffers: Buffer[] = [];

    for (const sampleFile of ATTACHMENT_SAMPLE_FILES) {
      const filePath = join(sampleFilesDir, sampleFile.filename);

      try {
        sampleFileBuffers.push(await readFile(filePath));
      } catch {
        // Gracefully skip if sample files are not available
        return;
      }
    }

    const fieldUniversalIdentifier =
      STANDARD_OBJECTS.attachment.fields.file.universalIdentifier;
    const applicationUniversalIdentifier =
      BADES_STANDARD_APPLICATION.universalIdentifier;

    for (const metadata of fileSeedMetadata) {
      const resourcePath = `${metadata.fileId}.${metadata.extension}`;
      const sourceFile = sampleFileBuffers[metadata.sampleFileIndex];

      await this.fileStorageService.writeFile({
        sourceFile,
        mimeType: metadata.mimeType,
        fileFolder: FileFolder.FilesField,
        applicationUniversalIdentifier,
        workspaceId,
        resourcePath: `${fieldUniversalIdentifier}/${resourcePath}`,
        fileId: metadata.fileId,
        settings: {
          isTemporaryFile: false,
          toDelete: false,
        },
        queryRunner: entityManager.queryRunner,
      });
    }
  }
}
