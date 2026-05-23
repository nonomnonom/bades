import { Injectable } from '@nestjs/common';

import chunk from 'lodash.chunk';
import { ObjectRecord } from 'shared/types';

import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { type WorkspaceEntityManager } from 'src/engine/sid-orm/entity-manager/workspace-entity-manager';
import { PENDUDUK_DATA_SEEDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/penduduk-data-seeds.constant';
import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

type RecordSeedWithId = Pick<ObjectRecord, 'id'> & Record<string, unknown>;

type TimelineActivitySeedData = Pick<
  TimelineActivityWorkspaceEntity,
  | 'id'
  | 'name'
  | 'linkedRecordCachedName'
  | 'linkedRecordId'
  | 'linkedObjectMetadataId'
  | 'workspaceMemberId'
  | 'targetNoteId'
  | 'targetTaskId'
  | 'targetPersonId'
  | 'targetCompanyId'
  | 'targetOpportunityId'
> & {
  properties: string; // JSON stringified for raw insertion
  createdAt: string; // ISO string for raw insertion
  updatedAt: string; // ISO string for raw insertion
  happensAt: string; // ISO string for raw insertion
};

type EntityConfig = {
  type: string;
  seeds: Array<RecordSeedWithId>;
};

@Injectable()
export class TimelineActivitySeederService {
  // Entity code prefix dipakai untuk generate deterministic id timeline activity.
  // Saat ini hanya penduduk yang menjadi sumber timeline aktivitas dev seed —
  // entity CRM legacy (note/task/calendarEvent/message) tidak diseed sebagai
  // record dasar, jadi tidak dimasukkan ke timeline activity untuk menghindari
  // FK violation pada kolom target*Id.
  private readonly ENTITY_CODES = {
    penduduk: '0001',
  } as const;

  constructor(private readonly objectMetadataService: ObjectMetadataService) {}

  async seedTimelineActivities({
    entityManager,
    schemaName,
    workspaceId,
  }: {
    entityManager: WorkspaceEntityManager;
    schemaName: string;
    workspaceId: string;
  }) {
    // Pastikan metadata penduduk tersedia di workspace ini sebelum mulai seed
    // (validasi cepat agar gagal eksplisit kalau workspace belum lengkap).
    await this.assertPendudukMetadataExists(workspaceId);

    const timelineActivities: TimelineActivitySeedData[] = [];

    const entityConfigs: EntityConfig[] = [
      { type: 'penduduk', seeds: PENDUDUK_DATA_SEEDS },
    ];

    entityConfigs.forEach(({ type, seeds }) => {
      seeds.forEach((seed, index) => {
        timelineActivities.push(
          this.createTimelineActivity({
            entityType: type,
            recordSeed: seed,
            index,
          }),
        );
      });
    });

    await this.insertTimelineActivities(
      entityManager,
      schemaName,
      timelineActivities,
    );
  }

  private async insertTimelineActivities(
    entityManager: WorkspaceEntityManager,
    schemaName: string,
    timelineActivities: TimelineActivitySeedData[],
  ) {
    if (timelineActivities.length === 0) {
      return;
    }

    const batchSize = 1000;
    const timelineActivityBatches = chunk(timelineActivities, batchSize);

    for (const batch of timelineActivityBatches) {
      await entityManager
        .createQueryBuilder(undefined, undefined, undefined, {
          shouldBypassPermissionChecks: true,
        })
        .insert()
        .into(`${schemaName}.timelineActivity`, [
          'id',
          'name',
          'properties',
          'linkedRecordCachedName',
          'linkedRecordId',
          'linkedObjectMetadataId',
          'workspaceMemberId',
          'targetNoteId',
          'targetTaskId',
          'targetPersonId',
          'targetCompanyId',
          'targetOpportunityId',
          'createdAt',
          'updatedAt',
          'happensAt',
        ])
        .orIgnore()
        .values(batch)
        .execute();
    }
  }

  private createTimelineActivity({
    entityType,
    recordSeed,
    index,
  }: {
    entityType: string;
    recordSeed: RecordSeedWithId;
    index: number;
  }): TimelineActivitySeedData {
    const timelineActivityId = this.generateTimelineActivityId(
      entityType,
      index + 1,
    );
    const creationDate = new Date().toISOString();
    const recordId = recordSeed.id;

    return {
      id: timelineActivityId,
      name: `${entityType}.created`,
      properties: JSON.stringify({
        after: this.getEventAfterRecordProperties(entityType, recordSeed),
      }),
      linkedRecordCachedName: '',
      linkedRecordId: recordId,
      linkedObjectMetadataId: null,
      workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      targetNoteId: null,
      targetTaskId: null,
      targetPersonId: null,
      targetCompanyId: null,
      targetOpportunityId: null,
      createdAt: creationDate,
      updatedAt: creationDate,
      happensAt: creationDate,
    };
  }

  private generateTimelineActivityId(type: string, index: number): string {
    const prefix = '20202020';
    const code =
      this.ENTITY_CODES[type as keyof typeof this.ENTITY_CODES] || '0000';
    const paddedIndex = String(index).padStart(4, '0');

    return `${prefix}-${code}-4000-8001-${paddedIndex}00000001`;
  }

  private getEventAfterRecordProperties(
    type: string,
    recordSeed: RecordSeedWithId,
  ): Record<string, unknown> {
    if (type !== 'penduduk') {
      return { id: recordSeed.id };
    }

    return {
      id: recordSeed.id,
      nik: recordSeed.nik,
      namaLengkap: {
        firstName: recordSeed.namaLengkapFirstName,
        lastName: recordSeed.namaLengkapLastName,
      },
      jenisKelamin: recordSeed.jenisKelamin,
      statusHidup: recordSeed.statusHidup,
    };
  }

  private async assertPendudukMetadataExists(
    workspaceId: string,
  ): Promise<void> {
    const pendudukMetadata =
      await this.objectMetadataService.findOneWithinWorkspace(workspaceId, {
        where: { nameSingular: 'penduduk' },
      });

    if (!pendudukMetadata) {
      throw new Error(
        'Could not find object metadata for "penduduk" in workspace ' +
          `${workspaceId} when seeding timeline activities`,
      );
    }
  }
}
