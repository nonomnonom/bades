import { PageLayoutTabLayoutMode } from 'shared/types';

import { PageLayoutType } from 'src/engine/metadata-modules/page-layout/enums/page-layout-type.enum';
import {
  type StandardPageLayoutConfig,
  type StandardPageLayoutTabConfig,
} from 'src/engine/workspace-manager/bades-standard-application/utils/page-layout-config/standard-page-layout-config.type';

// Bades: 8 widget CRM warisan (dealsByCompany, pipelineValueByStage,
// revenueTimeline, opportunitiesByOwner, stockMarketIframe dengan iframe
// star-history, dst) sudah dihapus. Tab default sekarang menampilkan
// satu widget sambutan ber-bahasa Indonesia agar dashboard tidak terlihat
// kosong saat workspace baru pertama dibuka. Widget statistik SID
// (jumlah Penduduk, Layanan per status, Aset per kondisi, dll) akan
// disuntik di iterasi berikutnya setelah resolver objectMetadataId untuk
// SID custom object siap.
const DASHBOARD_PAGE_TABS = {
  tab1: {
    universalIdentifier: '20202020-d011-4d11-8d11-da5ab0a01001',
    title: 'Tab 1',
    position: 0,
    icon: null,
    layoutMode: PageLayoutTabLayoutMode.GRID,
    widgets: {
      welcomeRichText: {
        universalIdentifier: '20202020-d111-4d11-8d11-da5ab0a11001',
      },
    },
  },
} as const satisfies Record<string, StandardPageLayoutTabConfig>;

export const STANDARD_DASHBOARD_PAGE_LAYOUT_CONFIG = {
  name: 'Dasbor Saya',
  type: PageLayoutType.DASHBOARD,
  objectUniversalIdentifier: null,
  universalIdentifier: '20202020-d001-4d01-8d01-da5ab0a00001',
  defaultTabUniversalIdentifier: null,
  tabs: DASHBOARD_PAGE_TABS,
} as const satisfies StandardPageLayoutConfig;
