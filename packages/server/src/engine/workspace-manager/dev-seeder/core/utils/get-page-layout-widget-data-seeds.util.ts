import { CalendarStartDay } from 'shared/constants';
import { STANDARD_OBJECTS } from 'shared/metadata';
import {
  AggregateOperations,
  PageLayoutTabLayoutMode,
} from 'shared/types';
import { isDefined } from 'shared/utils';

import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';
import { fromPageLayoutWidgetConfigurationToUniversalConfiguration } from 'src/engine/metadata-modules/flat-page-layout-widget/utils/from-page-layout-widget-configuration-to-universal-configuration.util';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { AxisNameDisplay } from 'src/engine/metadata-modules/page-layout-widget/enums/axis-name-display.enum';
import { BarChartLayout } from 'src/engine/metadata-modules/page-layout-widget/enums/bar-chart-layout.enum';
import { GraphOrderBy } from 'src/engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum';
import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';
import { WidgetType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-type.enum';
import { PAGE_LAYOUT_TAB_SEEDS } from 'src/engine/workspace-manager/dev-seeder/core/constants/page-layout-tab-seeds.constant';
import { PAGE_LAYOUT_WIDGET_SEEDS } from 'src/engine/workspace-manager/dev-seeder/core/constants/page-layout-widget-seeds.constant';
import { type SeederFlatPageLayoutWidget } from 'src/engine/workspace-manager/dev-seeder/core/types/seeder-flat-page-layout-widget.type';
import { generateSeedId } from 'src/engine/workspace-manager/dev-seeder/core/utils/generate-seed-id.util';
import { getPageLayoutWidgetDataSeedsV2 } from 'src/engine/workspace-manager/dev-seeder/core/utils/get-page-layout-widget-data-seeds-v2.util';
import {
  getSeedFrontComponentDefinitions,
  getSeedFrontComponentIds,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-front-component-definitions.util';

export const getPageLayoutWidgetFlatEntitySeeds = ({
  workspaceId,
  flatApplication,
  objectMetadataItems,
}: {
  workspaceId: string;
  flatApplication: FlatApplication;
  objectMetadataItems: ObjectMetadataEntity[];
}): FlatPageLayoutWidget[] => {
  const seeds = getPageLayoutWidgetDataSeeds(workspaceId, objectMetadataItems);
  const now = new Date().toISOString();

  const fieldMetadataUniversalIdentifierById: Record<string, string> = {};

  for (const objectMetadata of objectMetadataItems) {
    if (!isDefined(objectMetadata.fields)) {
      continue;
    }
    for (const field of objectMetadata.fields) {
      fieldMetadataUniversalIdentifierById[field.id] =
        field.universalIdentifier;
    }
  }

  const frontComponentUniversalIdentifierById: Record<string, string> = {};

  for (const definition of getSeedFrontComponentDefinitions(workspaceId)) {
    frontComponentUniversalIdentifierById[definition.id] =
      definition.universalIdentifier;
  }

  return seeds.map((seed) => {
    const objectMetadata = isDefined(seed.objectMetadataId)
      ? objectMetadataItems.find(
          (objectMetadataItem) =>
            objectMetadataItem.id === seed.objectMetadataId,
        )
      : undefined;

    const universalConfiguration =
      fromPageLayoutWidgetConfigurationToUniversalConfiguration({
        configuration: seed.configuration,
        fieldMetadataUniversalIdentifierById,
        frontComponentUniversalIdentifierById,
      });

    return {
      ...seed,
      universalIdentifier: seed.id,
      applicationId: flatApplication.id,
      applicationUniversalIdentifier: flatApplication.universalIdentifier,
      workspaceId,
      pageLayoutTabUniversalIdentifier: seed.pageLayoutTabId,
      objectMetadataUniversalIdentifier:
        objectMetadata?.universalIdentifier ?? null,
      universalConfiguration,
      conditionalDisplay: null,
      conditionalAvailabilityExpression: null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      universalOverrides: null,
    } as FlatPageLayoutWidget;
  });
};

const getFieldId = (
  object: ObjectMetadataEntity | undefined,
  fieldName: string,
): string | undefined => {
  return object?.fields?.find((field) => field.name === fieldName)?.id;
};

export const getPageLayoutWidgetDataSeeds = (
  workspaceId: string,
  objectMetadataItems: ObjectMetadataEntity[],
): SeederFlatPageLayoutWidget[] => {
  const taskObject = objectMetadataItems.find(
    (obj) =>
      obj.universalIdentifier === STANDARD_OBJECTS.task.universalIdentifier,
  );

  // Custom objects Bades SID
  const pendudukObject = objectMetadataItems.find(
    (obj) => obj.nameSingular === 'penduduk',
  );
  const keluargaObject = objectMetadataItems.find(
    (obj) => obj.nameSingular === 'keluarga',
  );
  const permohonanSuratObject = objectMetadataItems.find(
    (obj) => obj.nameSingular === 'permohonanSurat',
  );

  const taskIdFieldId = getFieldId(taskObject, 'id');

  // Field IDs untuk object Bades SID
  const pendudukIdFieldId = getFieldId(pendudukObject, 'id');
  const pendudukCreatedAtFieldId = getFieldId(pendudukObject, 'createdAt');
  const pendudukJenisKelaminFieldId = getFieldId(pendudukObject, 'jenisKelamin');
  const pendudukDusunFieldId = getFieldId(pendudukObject, 'dusun');
  const keluargaIdFieldId = getFieldId(keluargaObject, 'id');
  const permohonanIdFieldId = getFieldId(permohonanSuratObject, 'id');
  const permohonanCreatedAtFieldId = getFieldId(permohonanSuratObject, 'createdAt');

  const v1Widgets: SeederFlatPageLayoutWidget[] = [
    // Ringkasan Layanan Tab (Dasbor Pelayanan Warga)
    isDefined(permohonanIdFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.SALES_PIPELINE_VALUE,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.SALES_OVERVIEW,
          ),
          title: 'Total Permohonan Layanan',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 0, rowSpan: 2, columnSpan: 3 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 2,
            columnSpan: 3,
          },
          configuration: {
            configurationType: WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldMetadataId: permohonanIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: permohonanSuratObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,
    isDefined(pendudukIdFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.SALES_AVERAGE_DEAL_SIZE,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.SALES_OVERVIEW,
          ),
          title: 'Total Penduduk Terdaftar',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 3, rowSpan: 4, columnSpan: 4 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 3,
            rowSpan: 4,
            columnSpan: 4,
          },
          configuration: {
            configurationType: WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,
    isDefined(permohonanIdFieldId) && isDefined(permohonanCreatedAtFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.SALES_DEALS_BY_STAGE,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.SALES_OVERVIEW,
          ),
          title: 'Permohonan Layanan per Waktu',
          type: WidgetType.GRAPH,
          gridPosition: { row: 4, column: 0, rowSpan: 8, columnSpan: 6 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 4,
            column: 0,
            rowSpan: 8,
            columnSpan: 6,
          },
          configuration: {
            configurationType: WidgetConfigurationType.BAR_CHART,
            aggregateFieldMetadataId: permohonanIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataId: permohonanCreatedAtFieldId,
            primaryAxisOrderBy: GraphOrderBy.FIELD_ASC,
            axisNameDisplay: AxisNameDisplay.NONE,
            displayDataLabel: false,
            color: 'auto',
            layout: BarChartLayout.VERTICAL,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: permohonanSuratObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // Rincian Permohonan Tab (Dasbor Pelayanan Warga)
    isDefined(pendudukIdFieldId) && isDefined(pendudukCreatedAtFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.SALES_DEAL_DISTRIBUTION,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.SALES_DETAILS,
          ),
          title: 'Penduduk Baru per Periode',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 0, rowSpan: 5, columnSpan: 5 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 5,
            columnSpan: 5,
          },
          configuration: {
            configurationType: WidgetConfigurationType.BAR_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataId: pendudukCreatedAtFieldId,
            primaryAxisOrderBy: GraphOrderBy.FIELD_ASC,
            axisNameDisplay: AxisNameDisplay.NONE,
            displayDataLabel: false,
            color: 'auto',
            layout: BarChartLayout.VERTICAL,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,
    isDefined(permohonanIdFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.SALES_OPPORTUNITY_COUNT,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.SALES_DETAILS,
          ),
          title: 'Jumlah Permohonan Surat',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 5, rowSpan: 5, columnSpan: 7 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 5,
            rowSpan: 5,
            columnSpan: 7,
          },
          configuration: {
            configurationType: WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldMetadataId: permohonanIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: permohonanSuratObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // Ringkasan Warga Tab (Dasbor Kependudukan)
    isDefined(pendudukIdFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.CUSTOMER_TOTAL_COUNT,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_OVERVIEW,
          ),
          title: 'Total Penduduk',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 0, rowSpan: 2, columnSpan: 3 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 2,
            columnSpan: 3,
          },
          configuration: {
            configurationType: WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,
    isDefined(pendudukIdFieldId) && isDefined(pendudukDusunFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.CUSTOMER_COMPANIES_BY_SIZE,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_OVERVIEW,
          ),
          title: 'Penduduk per Dusun',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 6, rowSpan: 10, columnSpan: 6 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 6,
            rowSpan: 10,
            columnSpan: 6,
          },
          configuration: {
            configurationType: WidgetConfigurationType.BAR_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataId: pendudukDusunFieldId,
            primaryAxisOrderBy: GraphOrderBy.VALUE_DESC,
            axisNameDisplay: AxisNameDisplay.NONE,
            displayDataLabel: false,
            color: 'auto',
            layout: BarChartLayout.VERTICAL,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // Analitik Demografi Tab (Dasbor Kependudukan)
    isDefined(keluargaIdFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.CUSTOMER_ANNUAL_RECURRING_REVENUE,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_ANALYTICS,
          ),
          title: 'Total Kartu Keluarga',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 0, rowSpan: 4, columnSpan: 4 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 4,
            columnSpan: 4,
          },
          configuration: {
            configurationType: WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldMetadataId: keluargaIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: keluargaObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,
    isDefined(pendudukIdFieldId) && isDefined(pendudukJenisKelaminFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.CUSTOMER_LINKEDIN_COUNT,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_OVERVIEW,
          ),
          title: 'Distribusi Jenis Kelamin',
          type: WidgetType.GRAPH,
          gridPosition: { row: 2, column: 0, rowSpan: 4, columnSpan: 3 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 2,
            column: 0,
            rowSpan: 4,
            columnSpan: 3,
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

    // Perangkat & Lembaga Tab (Dasbor Perangkat Desa)
    isDefined(pendudukIdFieldId)
      ? ({
          id: generateSeedId(workspaceId, PAGE_LAYOUT_WIDGET_SEEDS.TEAM_SIZE),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.TEAM_OVERVIEW,
          ),
          title: 'Jumlah Warga Terdaftar',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 0, rowSpan: 5, columnSpan: 6 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 5,
            columnSpan: 6,
          },
          configuration: {
            configurationType: WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,
    isDefined(pendudukIdFieldId) && isDefined(pendudukDusunFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.TEAM_GEOGRAPHIC_DISTRIBUTION,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.TEAM_OVERVIEW,
          ),
          title: 'Sebaran Wilayah Dusun',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 6, rowSpan: 5, columnSpan: 6 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 6,
            rowSpan: 5,
            columnSpan: 6,
          },
          configuration: {
            configurationType: WidgetConfigurationType.BAR_CHART,
            aggregateFieldMetadataId: pendudukIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataId: pendudukDusunFieldId,
            primaryAxisOrderBy: GraphOrderBy.VALUE_DESC,
            axisNameDisplay: AxisNameDisplay.NONE,
            displayDataLabel: false,
            color: 'auto',
            layout: BarChartLayout.VERTICAL,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: pendudukObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // Tugas & Aktivitas Tab (Dasbor Perangkat Desa)
    isDefined(taskIdFieldId)
      ? ({
          id: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_WIDGET_SEEDS.TEAM_OPEN_TASKS,
          ),
          pageLayoutTabId: generateSeedId(
            workspaceId,
            PAGE_LAYOUT_TAB_SEEDS.TEAM_METRICS,
          ),
          title: 'Tugas Belum Selesai',
          type: WidgetType.GRAPH,
          gridPosition: { row: 0, column: 6, rowSpan: 6, columnSpan: 6 },
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 6,
            rowSpan: 6,
            columnSpan: 6,
          },
          configuration: {
            configurationType: WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldMetadataId: taskIdFieldId,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'Asia/Jakarta',
            firstDayOfTheWeek: CalendarStartDay.MONDAY,
          },
          objectMetadataId: taskObject?.id ?? null,
          overrides: null,
        } satisfies SeederFlatPageLayoutWidget)
      : null,

    // Sales Overview Tab Widgets - Front Component
    {
      id: generateSeedId(workspaceId, PAGE_LAYOUT_WIDGET_SEEDS.FRONT_COMPONENT),
      pageLayoutTabId: generateSeedId(
        workspaceId,
        PAGE_LAYOUT_TAB_SEEDS.SALES_OVERVIEW,
      ),
      title: 'Front Component',
      type: WidgetType.FRONT_COMPONENT,
      gridPosition: { row: 2, column: 7, rowSpan: 2, columnSpan: 5 },
      position: {
        layoutMode: PageLayoutTabLayoutMode.GRID,
        row: 2,
        column: 7,
        rowSpan: 2,
        columnSpan: 5,
      },
      configuration: {
        configurationType: WidgetConfigurationType.FRONT_COMPONENT,
        frontComponentId: getSeedFrontComponentIds(workspaceId).helloWorldId,
      } as const,
      objectMetadataId: null,
      overrides: null,
    } satisfies SeederFlatPageLayoutWidget,

    {
      id: generateSeedId(
        workspaceId,
        PAGE_LAYOUT_WIDGET_SEEDS.DOCUMENTATION_IFRAME,
      ),
      pageLayoutTabId: generateSeedId(
        workspaceId,
        PAGE_LAYOUT_TAB_SEEDS.DOCUMENTATION,
      ),
      title: 'Statistik Desa',
      type: WidgetType.IFRAME,
      gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
      position: {
        layoutMode: PageLayoutTabLayoutMode.GRID,
        row: 0,
        column: 0,
        rowSpan: 12,
        columnSpan: 12,
      },
      configuration: {
        configurationType: WidgetConfigurationType.IFRAME,
        url: 'https://bades.id/statistik-desa',
      },
      objectMetadataId: null,
      overrides: null,
    } satisfies SeederFlatPageLayoutWidget,
  ].filter(isDefined);

  const v2Widgets = getPageLayoutWidgetDataSeedsV2(
    workspaceId,
    objectMetadataItems,
  );

  return [...v1Widgets, ...v2Widgets];
};
