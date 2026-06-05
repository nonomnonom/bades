import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { Command, Option } from 'nest-commander';
import { addressCompositeType, FieldMetadataType } from 'shared/types';
import { DataSource, Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import {
  type RunOnWorkspaceArgs,
  type WorkspaceCommandOptions,
} from 'src/database/commands/command-runners/workspace.command-runner';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { GeoMapService } from 'src/engine/core-modules/geo-map/services/geo-map.service';
import { computeCompositeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { computeTableName } from 'src/engine/utils/compute-table-name.util';

type WorkspaceBackfillAddressCoordinatesOptions = WorkspaceCommandOptions & {
  limit?: number;
};

type AddressFieldRow = {
  fieldName: string;
  objectNameSingular: string;
  isCustom: boolean;
};

const ADDRESS_TEXT_PROPERTIES = addressCompositeType.properties.filter(
  (property) =>
    property.name !== 'addressLat' && property.name !== 'addressLng',
);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Isi addressLat/addressLng untuk record yang punya teks alamat tapi
// koordinat kosong, memakai Mapbox Geocoding (token MAPBOX_ACCESS_TOKEN).
@Command({
  name: 'workspace:backfill:address-coordinates',
  description:
    'Backfill koordinat field ADDRESS yang kosong via Mapbox Geocoding (tanpa Google API)',
})
export class WorkspaceBackfillAddressCoordinatesCommand extends ActiveOrSuspendedWorkspaceCommandRunner<WorkspaceBackfillAddressCoordinatesOptions> {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly geoMapService: GeoMapService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {
    super(workspaceIteratorService);
  }

  @Option({
    flags: '--limit <limit>',
    description:
      'Maksimum record per field ADDRESS yang di-geocode per workspace (default: 100)',
  })
  parseLimit(limit: string): number {
    return Number.parseInt(limit, 10);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;
    const limit =
      (options as WorkspaceBackfillAddressCoordinatesOptions).limit ?? 100;

    if (!this.geoMapService.isGeocodingEnabled()) {
      this.logger.warn(
        'MAPBOX_ACCESS_TOKEN belum diset — skip backfill koordinat alamat',
      );

      return;
    }

    const workspace = await this.workspaceRepository.findOne({
      select: ['id', 'databaseSchema'],
      where: { id: workspaceId },
    });

    if (!workspace?.databaseSchema) {
      this.logger.warn(
        `Workspace ${workspaceId} belum punya databaseSchema — skip`,
      );

      return;
    }

    const addressFields: AddressFieldRow[] = await this.coreDataSource.query(
      `
        SELECT fm.name AS "fieldName",
               om."nameSingular" AS "objectNameSingular",
               om."isCustom" AS "isCustom"
        FROM core."fieldMetadata" fm
        JOIN core."objectMetadata" om ON om.id = fm."objectMetadataId"
        WHERE fm."workspaceId" = $1
          AND fm.type = $2
          AND fm."deletedAt" IS NULL
          AND om."deletedAt" IS NULL
      `,
      [workspaceId, FieldMetadataType.ADDRESS],
    );

    if (addressFields.length === 0) {
      this.logger.log(
        `Workspace ${workspaceId} tidak punya field ADDRESS — skip`,
      );

      return;
    }

    let totalUpdated = 0;

    for (const addressField of addressFields) {
      const tableName = computeTableName(
        addressField.objectNameSingular,
        addressField.isCustom,
      );
      const quotedTableName = `"${tableName.replace(/"/g, '""')}"`;

      const latProperty = addressCompositeType.properties.find(
        (property) => property.name === 'addressLat',
      )!;
      const lngProperty = addressCompositeType.properties.find(
        (property) => property.name === 'addressLng',
      )!;
      const countryProperty = addressCompositeType.properties.find(
        (property) => property.name === 'addressCountry',
      )!;

      const latColumn = computeCompositeColumnName(
        addressField.fieldName,
        latProperty,
      );
      const lngColumn = computeCompositeColumnName(
        addressField.fieldName,
        lngProperty,
      );
      const countryColumn = computeCompositeColumnName(
        addressField.fieldName,
        countryProperty,
      );

      const textColumns = ADDRESS_TEXT_PROPERTIES.map((property) =>
        computeCompositeColumnName(addressField.fieldName, property),
      );

      const selectColumns = ['id', ...textColumns, latColumn, lngColumn]
        .map((column) => `"${column}"`)
        .join(', ');

      const hasAddressTextClause = textColumns
        .map((column) => `"${column}" IS NOT NULL AND TRIM("${column}") <> ''`)
        .join(' OR ');

      const rows: Record<string, string | number | null>[] =
        await this.coreDataSource.query(
          `
            SELECT ${selectColumns}
            FROM "${workspace.databaseSchema}".${quotedTableName}
            WHERE "deletedAt" IS NULL
              AND (${hasAddressTextClause})
              AND (
                "${latColumn}" IS NULL
                OR "${lngColumn}" IS NULL
                OR ("${latColumn}" = 0 AND "${lngColumn}" = 0)
              )
            LIMIT $1
          `,
          [limit],
        );

      for (const row of rows) {
        const addressParts = textColumns
          .map((column) => row[column])
          .filter(
            (value): value is string =>
              typeof value === 'string' && value.trim().length > 0,
          );

        if (addressParts.length === 0) {
          continue;
        }

        const countryCode = row[countryColumn] as string | null | undefined;
        const queryText = addressParts.join(', ');

        if (isDryRun) {
          this.logger.log(
            `[DRY RUN] Akan geocode ${addressField.objectNameSingular}.${addressField.fieldName} record ${row.id}: ${queryText}`,
          );
          continue;
        }

        const geocoded = await this.geoMapService.geocodeAddressFromText(
          queryText,
          typeof countryCode === 'string' ? countryCode : 'ID',
        );

        const lat = geocoded?.location?.lat;
        const lng = geocoded?.location?.lng;

        if (lat === undefined || lng === undefined) {
          this.logger.warn(
            `Geocode gagal untuk record ${row.id} (${queryText})`,
          );
          continue;
        }

        await this.coreDataSource.query(
          `
            UPDATE "${workspace.databaseSchema}".${quotedTableName}
            SET "${latColumn}" = $1, "${lngColumn}" = $2, "updatedAt" = NOW()
            WHERE id = $3
          `,
          [lat, lng, row.id],
        );

        totalUpdated += 1;

        // Hormati rate limit Mapbox Geocoding (~10 req/detik aman).
        await sleep(150);
      }
    }

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Backfill koordinat selesai untuk workspace ${workspaceId}: ${totalUpdated} record diperbarui`,
    );
  }
}
