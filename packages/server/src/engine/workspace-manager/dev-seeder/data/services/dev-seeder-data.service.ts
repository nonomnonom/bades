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
import { type WorkspaceEntityManager } from 'src/engine/twenty-orm/entity-manager/workspace-entity-manager';
import { computeTableName } from 'src/engine/utils/compute-table-name.util';
import {
  ATTACHMENT_DATA_SEED_COLUMNS,
  ATTACHMENT_SAMPLE_FILES,
  type AttachmentFileSeedMetadata,
  generateAttachmentSeedsForWorkspace,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/attachment-data-seeds.constant';
import {
  CALENDAR_CHANNEL_EVENT_ASSOCIATION_DATA_SEED_COLUMNS,
  CALENDAR_CHANNEL_EVENT_ASSOCIATION_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/calendar-channel-event-association-data-seeds.constant';
import {
  CALENDAR_EVENT_DATA_SEED_COLUMNS,
  CALENDAR_EVENT_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/calendar-event-data-seeds.constant';
import {
  CALENDAR_EVENT_PARTICIPANT_DATA_SEED_COLUMNS,
  getCalendarEventParticipantDataSeeds,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/calendar-event-participant-data-seeds.constant';
import {
  COMPANY_DATA_SEED_COLUMNS,
  COMPANY_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/company-data-seeds.constant';
import {
  CONNECTED_ACCOUNT_DATA_SEED_COLUMNS,
  CONNECTED_ACCOUNT_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/connected-account-data-seeds.constant';
import {
  DASHBOARD_DATA_SEED_COLUMNS,
  getDashboardDataSeeds,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/dashboard-data-seeds.constant';
import {
  EMPLOYMENT_HISTORY_DATA_SEED_COLUMNS,
  EMPLOYMENT_HISTORY_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/employment-history-data-seeds.constant';
import {
  MESSAGE_CHANNEL_DATA_SEED_COLUMNS,
  MESSAGE_CHANNEL_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/message-channel-data-seeds.constant';
import {
  MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_DATA_SEED_COLUMNS,
  MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/message-channel-message-association-data-seeds.constant';
import {
  MESSAGE_DATA_SEED_COLUMNS,
  MESSAGE_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/message-data-seeds.constant';
import {
  getMessageParticipantDataSeeds,
  MESSAGE_PARTICIPANT_DATA_SEED_COLUMNS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/message-participant-data-seeds.constant';
import {
  MESSAGE_THREAD_DATA_SEED_COLUMNS,
  MESSAGE_THREAD_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/message-thread-data-seeds.constant';
import {
  NOTE_DATA_SEED_COLUMNS,
  NOTE_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/note-data-seeds.constant';
import {
  NOTE_TARGET_DATA_SEED_COLUMNS,
  NOTE_TARGET_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/note-target-data-seeds.constant';
import {
  OPPORTUNITY_DATA_SEED_COLUMNS,
  OPPORTUNITY_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/opportunity-data-seeds.constant';
import {
  PERSON_DATA_SEED_COLUMNS,
  PERSON_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/person-data-seeds.constant';
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
  TASK_DATA_SEED_COLUMNS,
  TASK_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/task-data-seeds.constant';
import {
  TASK_TARGET_DATA_SEED_COLUMNS,
  TASK_TARGET_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/task-target-data-seeds.constant';
import {
  getWorkspaceMemberDataSeeds,
  WORKSPACE_MEMBER_DATA_SEED_COLUMNS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
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
  attachmentSeeds: RecordSeedConfig['recordSeeds'],
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
      tableName: 'company',
      pgColumns: COMPANY_DATA_SEED_COLUMNS,
      recordSeeds: COMPANY_DATA_SEEDS,
    },
    {
      tableName: 'dashboard',
      pgColumns: DASHBOARD_DATA_SEED_COLUMNS,
      recordSeeds: getDashboardDataSeeds(workspaceId),
    },
    {
      tableName: 'connectedAccount',
      pgColumns: CONNECTED_ACCOUNT_DATA_SEED_COLUMNS,
      recordSeeds: CONNECTED_ACCOUNT_DATA_SEEDS,
    },
  ];

  // Batch 3: Depends on company, connectedAccount
  const batch3: RecordSeedConfig[] = [
    {
      tableName: 'person',
      pgColumns: PERSON_DATA_SEED_COLUMNS,
      recordSeeds: PERSON_DATA_SEEDS,
    },
    {
      tableName: 'penduduk',
      pgColumns: PENDUDUK_DATA_SEED_COLUMNS,
      recordSeeds: PENDUDUK_DATA_SEEDS,
    },
    {
      tableName: 'keluarga',
      pgColumns: KELUARGA_DATA_SEED_COLUMNS,
      recordSeeds: KELUARGA_DATA_SEEDS,
    },
    {
      tableName: 'jenisSurat',
      pgColumns: JENIS_SURAT_DATA_SEED_COLUMNS,
      recordSeeds: JENIS_SURAT_DATA_SEEDS,
    },
    {
      tableName: 'messageChannel',
      pgColumns: MESSAGE_CHANNEL_DATA_SEED_COLUMNS,
      recordSeeds: MESSAGE_CHANNEL_DATA_SEEDS,
    },
  ];

  // Batch 4: Depends on person/company/messageChannel or independent
  const batch4: RecordSeedConfig[] = [
    {
      tableName: 'opportunity',
      pgColumns: OPPORTUNITY_DATA_SEED_COLUMNS,
      recordSeeds: OPPORTUNITY_DATA_SEEDS,
    },
    {
      tableName: 'note',
      pgColumns: NOTE_DATA_SEED_COLUMNS,
      recordSeeds: NOTE_DATA_SEEDS,
    },
    {
      tableName: 'task',
      pgColumns: TASK_DATA_SEED_COLUMNS,
      recordSeeds: TASK_DATA_SEEDS,
    },
    {
      tableName: 'calendarEvent',
      pgColumns: CALENDAR_EVENT_DATA_SEED_COLUMNS,
      recordSeeds: CALENDAR_EVENT_DATA_SEEDS,
    },
    {
      tableName: 'messageThread',
      pgColumns: MESSAGE_THREAD_DATA_SEED_COLUMNS,
      recordSeeds: MESSAGE_THREAD_DATA_SEEDS,
    },
    {
      tableName: 'permohonanSurat',
      pgColumns: PERMOHONAN_SURAT_DATA_SEED_COLUMNS,
      recordSeeds: PERMOHONAN_SURAT_DATA_SEEDS,
    },
    {
      tableName: 'jabatan',
      pgColumns: JABATAN_DATA_SEED_COLUMNS,
      recordSeeds: JABATAN_DATA_SEEDS,
    },
    {
      tableName: 'lembagaDesa',
      pgColumns: LEMBAGA_DESA_DATA_SEED_COLUMNS,
      recordSeeds: LEMBAGA_DESA_DATA_SEEDS,
    },
    {
      tableName: 'anggaran',
      pgColumns: ANGGARAN_DATA_SEED_COLUMNS,
      recordSeeds: ANGGARAN_DATA_SEEDS,
    },
    {
      tableName: 'realisasiAnggaran',
      pgColumns: REALISASI_ANGGARAN_DATA_SEED_COLUMNS,
      recordSeeds: REALISASI_ANGGARAN_DATA_SEEDS,
    },
    {
      tableName: 'programBantuan',
      pgColumns: PROGRAM_BANTUAN_DATA_SEED_COLUMNS,
      recordSeeds: PROGRAM_BANTUAN_DATA_SEEDS,
    },
    {
      tableName: 'penerimaBantuan',
      pgColumns: PENERIMA_BANTUAN_DATA_SEED_COLUMNS,
      recordSeeds: PENERIMA_BANTUAN_DATA_SEEDS,
    },
    {
      tableName: 'asetDesa',
      pgColumns: ASET_DESA_DATA_SEED_COLUMNS,
      recordSeeds: ASET_DESA_DATA_SEEDS,
    },
    {
      tableName: 'umkm',
      pgColumns: UMKM_DATA_SEED_COLUMNS,
      recordSeeds: UMKM_DATA_SEEDS,
    },
    // Junction tables
    {
      tableName: '_employmentHistory',
      pgColumns: EMPLOYMENT_HISTORY_DATA_SEED_COLUMNS,
      recordSeeds: EMPLOYMENT_HISTORY_DATA_SEEDS,
    },
  ];

  // Batch 5: Depends on batch 4 entities
  const batch5: RecordSeedConfig[] = [
    {
      tableName: 'noteTarget',
      pgColumns: NOTE_TARGET_DATA_SEED_COLUMNS,
      recordSeeds: NOTE_TARGET_DATA_SEEDS,
    },
    {
      tableName: 'taskTarget',
      pgColumns: TASK_TARGET_DATA_SEED_COLUMNS,
      recordSeeds: TASK_TARGET_DATA_SEEDS,
    },
    {
      tableName: 'calendarChannelEventAssociation',
      pgColumns: CALENDAR_CHANNEL_EVENT_ASSOCIATION_DATA_SEED_COLUMNS,
      recordSeeds: CALENDAR_CHANNEL_EVENT_ASSOCIATION_DATA_SEEDS,
    },
    {
      tableName: 'calendarEventParticipant',
      pgColumns: CALENDAR_EVENT_PARTICIPANT_DATA_SEED_COLUMNS,
      recordSeeds: getCalendarEventParticipantDataSeeds(workspaceId),
    },
    {
      tableName: 'message',
      pgColumns: MESSAGE_DATA_SEED_COLUMNS,
      recordSeeds: MESSAGE_DATA_SEEDS,
    },
  ];

  // Batch 6: Depends on batch 5 entities
  const batch6: RecordSeedConfig[] = [
    {
      tableName: 'messageChannelMessageAssociation',
      pgColumns: MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_DATA_SEED_COLUMNS,
      recordSeeds: MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_DATA_SEEDS,
    },
    {
      tableName: 'messageParticipant',
      pgColumns: MESSAGE_PARTICIPANT_DATA_SEED_COLUMNS,
      recordSeeds: getMessageParticipantDataSeeds(workspaceId),
    },
    {
      tableName: 'attachment',
      pgColumns: ATTACHMENT_DATA_SEED_COLUMNS,
      recordSeeds: attachmentSeeds,
    },
  ];

  return [batch1, batch2, batch3, batch4, batch5, batch6];
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

    const { seeds: attachmentSeeds, fileSeedMetadata: attachmentFileMeta } =
      generateAttachmentSeedsForWorkspace(workspaceId);

    await this.coreDataSource.transaction(
      async (entityManager: WorkspaceEntityManager) => {
        await this.seedRecordsInBatches({
          entityManager,
          schemaName,
          workspaceId,
          attachmentSeeds,
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
    attachmentSeeds,
    featureFlags,
    objectMetadataItems,
    light = false,
  }: {
    entityManager: WorkspaceEntityManager;
    schemaName: string;
    workspaceId: string;
    attachmentSeeds: RecordSeedConfig['recordSeeds'];
    featureFlags?: Record<FeatureFlagKey, boolean>;
    objectMetadataItems: FlatObjectMetadata[];
    light?: boolean;
  }) {
    const batches = getRecordSeedsBatches(
      workspaceId,
      attachmentSeeds,
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
    const IS_BUILT = __dirname.includes('/dist/');
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

      sampleFileBuffers.push(await readFile(filePath));
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
