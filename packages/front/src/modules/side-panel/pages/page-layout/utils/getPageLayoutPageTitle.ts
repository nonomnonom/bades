import { type PageLayoutSidePanelPage } from '@/side-panel/pages/page-layout/types/PageLayoutSidePanelPage';
import { SidePanelPages } from 'shared/types';
import { assertUnreachable } from 'shared/utils';

export const getPageLayoutPageTitle = (page: PageLayoutSidePanelPage) => {
  switch (page) {
    case SidePanelPages.PageLayoutDashboardWidgetTypeSelect:
      return `Tambah Widget`;
    case SidePanelPages.DashboardChartSettings:
      return `Pilih Jenis Grafik`;
    case SidePanelPages.DashboardIframeSettings:
      return `Pengaturan iFrame`;
    case SidePanelPages.PageLayoutTabSettings:
      return `Pengaturan Tab`;
    case SidePanelPages.RecordPageFieldsSettings:
      return `Pengaturan Kolom`;
    case SidePanelPages.RecordPageFieldSettings:
      return `Widget kolom tunggal`;
    case SidePanelPages.DashboardRecordTableSettings:
      return `Pengaturan Tabel Data`;
    case SidePanelPages.PageLayoutRecordPageWidgetTypeSelect:
      return `Widget baru`;
    default:
      assertUnreachable(page);
  }
};
