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
import {
  DASHBOARD_DATA_SEED_COLUMNS,
  getDashboardDataSeeds,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/dashboard-data-seeds.constant';
import {
  getWorkspaceMemberDataSeeds,
  WORKSPACE_MEMBER_DATA_SEED_COLUMNS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
import {
  ATTACHMENT_SAMPLE_FILES,
  type AttachmentFileSeedMetadata,
  generateAttachmentSeedsForWorkspace,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/attachment-data-seeds.constant';
import { prefillFrontComponentCommandMenuItems } from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-front-component-command-menu-items.util';
import { prefillWorkflowCommandMenuItems } from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-workflow-command-menu-items.util';
import { prefillWorkflows } from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-workflows.util';
import { BADES_STANDARD_APPLICATION } from 'src/engine/workspace-manager/bades-standard-application/constants/bades-standard-applications';
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

  return [batch1, batch2];
};

@Injectable()
export class DevSeederDataService {
  constructor(
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
    private readonly objectMetadataService: ObjectMetadataService,
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
          // Bades: timeline-activity seeder dihapus bersama person/company
          // sehingga seed tidak menulis aktivitas demo CRM lagi.
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
    const batches = getRecordSeedsBatches(workspaceId, featureFlags);

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
