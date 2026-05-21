import { type PageLayoutSidePanelPage } from '@/side-panel/pages/page-layout/types/PageLayoutSidePanelPage';
import { t } from '@lingui/core/macro';
import { SidePanelPages } from 'shared/types';
import { assertUnreachable } from 'shared/utils';

export const getPageLayoutPageTitle = (page: PageLayoutSidePanelPage) => {
  switch (page) {
    case SidePanelPages.PageLayoutDashboardWidgetTypeSelect:
      return ""Add Widget";
    case SidePanelPages.DashboardChartSettings:
      return ""Select Graph Type";
    case SidePanelPages.DashboardIframeSettings:
      return ""iFrame Settings";
    case SidePanelPages.PageLayoutTabSettings:
      return ""Tab Settings";
    case SidePanelPages.RecordPageFieldsSettings:
      return ""Fields Settings";
    case SidePanelPages.RecordPageFieldSettings:
      return ""Field widget";
    case SidePanelPages.DashboardRecordTableSettings:
      return ""Record Table Settings";
    case SidePanelPages.PageLayoutRecordPageWidgetTypeSelect:
      return ""New widget";
    default:
      assertUnreachable(page);
  }
};
