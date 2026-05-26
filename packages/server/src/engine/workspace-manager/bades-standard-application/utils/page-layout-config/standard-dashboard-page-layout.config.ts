import { PageLayoutTabLayoutMode } from 'shared/types';

import { PageLayoutType } from 'src/engine/metadata-modules/page-layout/enums/page-layout-type.enum';
import {
  type StandardPageLayoutConfig,
  type StandardPageLayoutTabConfig,
} from 'src/engine/workspace-manager/bades-standard-application/utils/page-layout-config/standard-page-layout-config.type';

// Bades: dashboard default warisan Twenty (8 widget CRM — dealsByCompany,
// pipelineValueByStage, revenueTimeline, opportunitiesByOwner,
// stockMarketIframe yang menampilkan iframe star-history, dst) sudah
// dihapus dari `compute-my-first-dashboard-widgets.util.ts`. Tab di
// sini sengaja kosong — widget desa (Penduduk per Wilayah, Realisasi
// APBDes, dll) akan disuntik dari layer SID standard seed pada inisiatif
// berikut.
const DASHBOARD_PAGE_TABS = {
  tab1: {
    universalIdentifier: '20202020-d011-4d11-8d11-da5ab0a01001',
    title: 'Tab 1',
    position: 0,
    icon: null,
    layoutMode: PageLayoutTabLayoutMode.GRID,
    widgets: {},
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
