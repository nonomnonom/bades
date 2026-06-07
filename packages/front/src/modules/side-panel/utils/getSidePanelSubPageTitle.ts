import { SidePanelSubPages } from '@/side-panel/types/SidePanelSubPages';
import { assertUnreachable } from 'shared/utils';

export const getSidePanelSubPageTitle = (
  subPage: SidePanelSubPages,
): string => {
  switch (subPage) {
    case SidePanelSubPages.PageLayoutGraphFilter:
      return `Filter`;
    case SidePanelSubPages.PageLayoutFieldsLayout:
      return `Tata Letak`;
    case SidePanelSubPages.PageLayoutRecordTableFilter:
      return `Filter`;
    case SidePanelSubPages.PageLayoutRecordTableSort:
      return `Urutan`;
    case SidePanelSubPages.NewSidebarItemMainMenu:
      return `Tambah item menu`;
    case SidePanelSubPages.NewSidebarItemViewObjectPicker:
      return `Pilih objek`;
    case SidePanelSubPages.NewSidebarItemViewPicker:
      return `Pilih tampilan`;
    case SidePanelSubPages.NewSidebarItemViewSystemPicker:
      return `Objek sistem`;
    case SidePanelSubPages.NewSidebarItemObjectPicker:
      return `Pilih objek`;
    case SidePanelSubPages.NewSidebarItemObjectSystemPicker:
      return `Objek sistem`;
    case SidePanelSubPages.NewSidebarItemRecord:
      return `Tambah data`;
    case SidePanelSubPages.EditFolderPicker:
      return `Pindah ke folder`;
    default:
      assertUnreachable(subPage);
  }
};
