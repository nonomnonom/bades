import { SidePanelSubPages } from '@/side-panel/types/SidePanelSubPages';
import { t } from '~/utils/i18n/badesI18n';
import { assertUnreachable } from 'shared/utils';

export const getSidePanelSubPageTitle = (
  subPage: SidePanelSubPages,
): string => {
  switch (subPage) {
    case SidePanelSubPages.PageLayoutGraphFilter:
      return t`Filter`;
    case SidePanelSubPages.PageLayoutFieldsLayout:
      return t`Tata Letak`;
    case SidePanelSubPages.PageLayoutRecordTableFilter:
      return t`Filter`;
    case SidePanelSubPages.PageLayoutRecordTableSort:
      return t`Urutan`;
    case SidePanelSubPages.NewSidebarItemMainMenu:
      return t`Tambah item menu`;
    case SidePanelSubPages.NewSidebarItemViewObjectPicker:
      return t`Pilih objek`;
    case SidePanelSubPages.NewSidebarItemViewPicker:
      return t`Pilih tampilan`;
    case SidePanelSubPages.NewSidebarItemViewSystemPicker:
      return t`Objek sistem`;
    case SidePanelSubPages.NewSidebarItemObjectPicker:
      return t`Pilih objek`;
    case SidePanelSubPages.NewSidebarItemObjectSystemPicker:
      return t`Objek sistem`;
    case SidePanelSubPages.NewSidebarItemRecord:
      return t`Tambah data`;
    case SidePanelSubPages.EditFolderPicker:
      return t`Pindah ke folder`;
    default:
      assertUnreachable(subPage);
  }
};
