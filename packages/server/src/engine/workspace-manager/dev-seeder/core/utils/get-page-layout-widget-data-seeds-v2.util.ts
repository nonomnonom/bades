import { CalendarStartDay } from 'shared/constants';
import {
  AggregateOperations,
  PageLayoutTabLayoutMode,
} from 'shared/types';
import { isDefined } from 'shared/utils';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { AxisNameDisplay } from 'src/engine/metadata-modules/page-layout-widget/enums/axis-name-display.enum';
import { GraphOrderBy } from 'src/engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum';
import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';
import { WidgetType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-type.enum';
import { PAGE_LAYOUT_TAB_SEEDS } from 'src/engine/workspace-manager/dev-seeder/core/constants/page-layout-tab-seeds.constant';
import { PAGE_LAYOUT_WIDGET_SEEDS } from 'src/engine/workspace-manager/dev-seeder/core/constants/page-layout-widget-seeds.constant';
import { type SeederFlatPageLayoutWidget } from 'src/engine/workspace-manager/dev-seeder/core/types/seeder-flat-page-layout-widget.type';
import { generateSeedId } from 'src/engine/workspace-manager/dev-seeder/core/utils/generate-seed-id.util';

const getFieldId = (
  object: ObjectMetadataEntity | undefined,
  fieldName: string,
): string | undefined => {
  return object?.fields?.find((field) => field.name === fieldName)?.id;
};

export const getPageLayoutWidgetDataSeedsV2 = (
  workspaceId: string,
  objectMetadataItems: ObjectMetadataEntity[],
): SeederFlatPageLayoutWidget[] => {
  // Bades SID custom objects
  const pendudukObject = objectMetadataItems.find(
    (obj) => obj.nameSingular === 'penduduk',
  );
  const keluargaObject = objectMetadataItems.find(
    (obj) => obj.nameSingular === 'keluarga',
  );
  const permohonanSuratObject = objectMetadataItems.find(
    (obj) => obj.nameSingular === 'permohonanSurat',
  );

  const pendudukIdFieldId = getFieldId(pendudukObject, 'id');
  const pendudukCreatedAtFieldId = getFieldId(pendudukObject, 'createdAt');
  const pendudukJenisKelaminFieldId = getFieldId(pendudukObject, 'jenisKelamin');

  const keluargaIdFieldId = getFieldId(keluargaObject, 'id');
  const keluargaCreatedAtFieldId = getFieldId(keluargaObject, 'createdAt');

  const permohonanIdFieldId = getFieldId(permohonanSuratObject, 'id');
  const permohonanCreatedAtFieldId = getFieldId(
    permohonanSuratObject,
    'createdAt',
  );

  return [
    // LINE chart: Pertumbuhan Warga per Waktu (Ringkasan Layanan)
    isDefined(pendudukIdFieldId) && isDefined(pendudukCreatedAtFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.SALES_REVENUE_FORECAST,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.SALES_OVERVIEW,
          ),
          title: 'Pertumbuhan Warga per Waktu',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 7, rowSpan: 8, columnSpan: 5 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 7,
            rowSpan: 8,
            columnSpan: 5,
          },
          configuration: {
            configurationType: WidgetConfigurationType.LINE_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataId: pendudukCreatedAtFieldId,
            primaryAxisOrderBy: GraphOrderBy.FIELD_ASC,
            axisNameDisplay: AxisNameDisplay.NONE,
            displayDataLabel: false,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // LINE chart: Permohonan Baru per Waktu (Ringkasan Warga)
    isDefined(permohonanIdFieldId) && isDefined(permohonanCreatedAtFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.CUSTOMER_NEW_OVER_TIME,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_OVERVIEW,
          ),
          title: 'Permohonan Baru per Waktu',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 3, rowSpan: 6, columnSpan: 5 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 3,
            rowSpan: 6,
            columnSpan: 5,
          },
          configuration: {
            configurationType: WidgetConfigurationType.LINE_CHART,
            aggregateFieldMetadataId: permohonanIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataId: permohonanCreatedAtFieldId,
            primaryAxisOrderBy: GraphOrderBy.FIELD_ASC,
            axisNameDisplay: AxisNameDisplay.NONE,
            displayDataLabel: false,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: permohonanSuratObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // PIE chart: Distribusi KK per Periode (Analitik Demografi)
    isDefined(keluargaIdFieldId) && isDefined(keluargaCreatedAtFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.CUSTOMER_REVENUE_DISTRIBUTION,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_ANALYTICS,
          ),
          title: 'Kartu Keluarga per Periode',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 4, rowSpan: 2, columnSpan: 3 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 4,
            rowSpan: 2,
            columnSpan: 3,
          },
          configuration: {
            configurationType: WidgetConfigurationType.LINE_CHART,
            aggregateFieldMetadataId: keluargaIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataId: keluargaCreatedAtFieldId,
            primaryAxisOrderBy: GraphOrderBy.FIELD_ASC,
            axisNameDisplay: AxisNameDisplay.NONE,
            displayDataLabel: false,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: keluargaObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // PIE chart: Distribusi Jenis Kelamin Warga (Ringkasan Warga)
    isDefined(pendudukIdFieldId) && isDefined(pendudukJenisKelaminFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.CUSTOMER_LINKEDIN_DISTRIBUTION,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_OVERVIEW,
          ),
          title: 'Komposisi Jenis Kelamin Warga',
          type: WidgetType.GRAPH,
          gridPosition: { row: 6, column: 0, rowSpan: 4, columnSpan: 6 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 6,
            column: 0,
            rowSpan: 4,
            columnSpan: 6,
          },
          configuration: {
            configurationType: WidgetConfigurationType.PIE_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataId: pendudukJenisKelaminFieldId,
            orderBy: GraphOrderBy.VALUE_DESC,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // PIE chart: Distribusi Agama Warga (Tugas & Aktivitas)
    isDefined(pendudukIdFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.TEAM_CONTACT_ROLES,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.TEAM_METRICS,
          ),
          title: 'Distribusi Agama Warga',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 0, rowSpan: 4, columnSpan: 6 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 4,
            columnSpan: 6,
          },
          configuration: {
            configurationType: WidgetConfigurationType.PIE_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataId: pendudukIdFieldId,
            orderBy: GraphOrderBy.VALUE_DESC,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,
  ].filter(isDefined);
};
