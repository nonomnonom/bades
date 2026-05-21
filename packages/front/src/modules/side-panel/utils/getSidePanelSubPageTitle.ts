import { SidePanelSubPages } from '@/side-panel/types/SidePanelSubPages';
import { t } from '@lingui/core/macro';
import { assertUnreachable } from 'shared/utils';

export const getSidePanelSubPageTitle = (
  subPage: SidePanelSubPages,
): string => {
  switch (subPage) {
    case SidePanelSubPages.PageLayoutGraphFilter:
      return "Filter-filter";
    case SidePanelSubPages.PageLayoutFieldsLayout:
      return "Tata letak";
    case SidePanelSubPages.PageLayoutRecordTableFilter:
      return "Filter-filter";
    case SidePanelSubPages.PageLayoutRecordTableSort:
      return ""Sorts";
    case SidePanelSubPages.NewSidebarItemMainMenu:
      return ""Add menu item";
    case SidePanelSubPages.NewSidebarItemViewObjectPicker:
      return ""Pick an object";
    case SidePanelSubPages.NewSidebarItemViewPicker:
      return ""Pick a view";
    case SidePanelSubPages.NewSidebarItemViewSystemPicker:
      return ""System objects";
    case SidePanelSubPages.NewSidebarItemObjectPicker:
      return ""Pick an object";
    case SidePanelSubPages.NewSidebarItemObjectSystemPicker:
      return ""System objects";
    case SidePanelSubPages.NewSidebarItemRecord:
      return "Tambah rekaman";
    case SidePanelSubPages.EditFolderPicker:
      return ""Move to a folder";
    default:
      assertUnreachable(subPage);
  }
};
