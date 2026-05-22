import { type PageLayoutSidePanelPage } from '@/side-panel/pages/page-layout/types/PageLayoutSidePanelPage';
import { t } from '@lingui/core/macro';
import { SidePanelPages } from 'shared/types';
import { assertUnreachable } from 'shared/utils';

export const getPageLayoutPageTitle = (page: PageLayoutSidePanelPage) => {
  switch (page) {
    case SidePanelPages.PageLayoutDashboardWidgetTypeSelect:
      return t`Tambah Widget`;
    case SidePanelPages.DashboardChartSettings:
      return t`Pilih Jenis Grafik`;
    case SidePanelPages.DashboardIframeSettings:
      return t`Pengaturan iFrame`;
    case SidePanelPages.PageLayoutTabSettings:
      return t`Pengaturan Tab`;
    case SidePanelPages.RecordPageFieldsSettings:
      return t`Pengaturan Kolom`;
    case SidePanelPages.RecordPageFieldSettings:
      return t`Widget kolom tunggal`;
    case SidePanelPages.DashboardRecordTableSettings:
      return t`Pengaturan Tabel Data`;
    case SidePanelPages.PageLayoutRecordPageWidgetTypeSelect:
      return t`Widget baru`;
    default:
      assertUnreachable(page);
  }
};
