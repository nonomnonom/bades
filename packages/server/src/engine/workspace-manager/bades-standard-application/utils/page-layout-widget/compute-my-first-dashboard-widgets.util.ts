import { PageLayoutTabLayoutMode } from 'shared/types';
import { v4 } from 'uuid';

import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';
import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';
import { WidgetType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-type.enum';
import {
  type CreateStandardPageLayoutWidgetArgs,
  createStandardPageLayoutWidgetFlatMetadata,
} from 'src/engine/workspace-manager/bades-standard-application/utils/page-layout-widget/create-standard-page-layout-widget-flat-metadata.util';

type DashboardWidgetBuilderArgs = Omit<
  CreateStandardPageLayoutWidgetArgs,
  'context'
>;

// Bades: dashboard default 'Dasbor Saya' diisi satu widget rich text
// berbahasa Indonesia yang menyambut operator desa, menjelaskan 9 object
// SID inti yang tersedia, dan mengarahkan ke alur kerja sehari-hari. Widget
// statistik agregat (jumlah Penduduk per wilayah, status Layanan, kondisi
// Aset Desa) akan ditambahkan setelah resolver objectMetadataId untuk SID
// custom object diintegrasikan ke standar registry.
const createWelcomeRichText = ({
  args,
}: {
  args: DashboardWidgetBuilderArgs;
}): FlatPageLayoutWidget => {
  const configuration = {
    configurationType: WidgetConfigurationType.STANDALONE_RICH_TEXT as const,
    body: {
      blocknote: JSON.stringify([
        {
          id: v4(),
          type: 'heading',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Selamat datang di Bades',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Bades adalah Sistem Informasi Desa (SID) untuk membantu balai desa mengelola data administrasi sehari-hari dalam satu tempat.',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [],
          children: [],
        },
        {
          id: v4(),
          type: 'heading',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
            level: 3,
          },
          content: [
            {
              type: 'text',
              text: 'Data inti yang sudah disiapkan',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'bulletListItem',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            { type: 'text', text: 'Penduduk', styles: { bold: true } },
            {
              type: 'text',
              text: ' — data warga sesuai format KTP-el (Permendagri 109/2019).',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'bulletListItem',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            { type: 'text', text: 'Keluarga', styles: { bold: true } },
            {
              type: 'text',
              text: ' — data per Kartu Keluarga.',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'bulletListItem',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            { type: 'text', text: 'Wilayah', styles: { bold: true } },
            {
              type: 'text',
              text: ' — pembagian Dusun, RW, dan RT desa.',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'bulletListItem',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            { type: 'text', text: 'Layanan & Surat', styles: { bold: true } },
            {
              type: 'text',
              text: ' — alur permohonan surat warga dan arsip surat masuk-keluar.',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'bulletListItem',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            { type: 'text', text: 'Perangkat Desa', styles: { bold: true } },
            {
              type: 'text',
              text: ' — daftar penduduk yang sedang atau pernah menjabat.',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'bulletListItem',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Program Bantuan & Penerima Bantuan',
              styles: { bold: true },
            },
            {
              type: 'text',
              text: ' — PKH, BLT-DD, BPNT, dan program sosial lain.',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'bulletListItem',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            { type: 'text', text: 'Aset Desa', styles: { bold: true } },
            {
              type: 'text',
              text: ' — aset bergerak dan tak bergerak milik desa (Permendagri 1/2016).',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: v4(),
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [],
          children: [],
        },
        {
          id: v4(),
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Beberapa record contoh sudah ditanam di setiap object agar Anda bisa langsung melihat tampilan tabel. Anda bebas menghapusnya kapan saja dan mengganti dengan data desa Anda yang sebenarnya. Klik ',
              styles: {},
            },
            { type: 'text', text: 'Sunting', styles: { code: true } },
            {
              type: 'text',
              text: ' di pojok kanan atas untuk menyesuaikan dasbor ini.',
              styles: {},
            },
          ],
          children: [],
        },
      ]),
      markdown: null,
    },
  };

  return createStandardPageLayoutWidgetFlatMetadata({
    ...args,
    objectMetadataUniversalIdentifier: null,
    context: {
      layoutName: 'myFirstDashboard',
      tabTitle: 'tab1',
      widgetName: 'welcomeRichText',
      title: 'Selamat datang di Bades',
      type: WidgetType.STANDALONE_RICH_TEXT,
      gridPosition: { row: 0, column: 0, rowSpan: 8, columnSpan: 12 },
      position: {
        layoutMode: PageLayoutTabLayoutMode.GRID,
        row: 0,
        column: 0,
        rowSpan: 8,
        columnSpan: 12,
      },
      configuration,
      universalConfiguration: configuration,
      objectMetadataId: null,
      conditionalDisplay: null,
      conditionalAvailabilityExpression: null,
    },
  });
};

export const computeMyFirstDashboardWidgets = (
  args: Omit<CreateStandardPageLayoutWidgetArgs, 'context'>,
): FlatPageLayoutWidget[] => {
  return [createWelcomeRichText({ args })];
};
