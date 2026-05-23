import { useLingui } from '~/utils/i18n/badesI18n';
import {
  IconChevronDown,
  IconChevronUp,
  IconFolderSymlink,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconTrash,
} from 'ui/display';

import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { CommandMenuItem } from '@/command-menu/components/CommandMenuItem';
import { SidePanelNavigationItemActions } from '@/navigation-menu-item/edit/side-panel/constants/side-panel-navigation-item-actions';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';

export type OrganizeActionsProps = {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onAddBefore?: () => void;
  onAddAfter?: () => void;
};

type SidePanelEditOrganizeActionsProps = OrganizeActionsProps & {
  showMoveToFolder?: boolean;
  onMoveToFolder?: () => void;
};

export const SidePanelEditOrganizeActions = ({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAddBefore,
  onAddAfter,
  showMoveToFolder = false,
  onMoveToFolder,
}: SidePanelEditOrganizeActionsProps) => {
  const { t } = useLingui();

  return (
    <SidePanelGroup heading={t`Atur`}>
      <SelectableListItem
        itemId={SidePanelNavigationItemActions.MOVE_UP}
        onEnter={canMoveUp ? onMoveUp : undefined}
      >
        <CommandMenuItem
          Icon={IconChevronUp}
          label={t`Naik`}
          id={SidePanelNavigationItemActions.MOVE_UP}
          onClick={onMoveUp}
          disabled={!canMoveUp}
        />
      </SelectableListItem>
      <SelectableListItem
        itemId={SidePanelNavigationItemActions.MOVE_DOWN}
        onEnter={canMoveDown ? onMoveDown : undefined}
      >
        <CommandMenuItem
          Icon={IconChevronDown}
          label={t`Turun`}
          id={SidePanelNavigationItemActions.MOVE_DOWN}
          onClick={onMoveDown}
          disabled={!canMoveDown}
        />
      </SelectableListItem>
      {showMoveToFolder && onMoveToFolder && (
        <SelectableListItem
          itemId={SidePanelNavigationItemActions.MOVE_TO_FOLDER}
          onEnter={onMoveToFolder}
        >
          <CommandMenuItem
            Icon={IconFolderSymlink}
            label={t`Pindahkan ke folder`}
            id={SidePanelNavigationItemActions.MOVE_TO_FOLDER}
            hasSubMenu
            onClick={onMoveToFolder}
          />
        </SelectableListItem>
      )}
      {onAddBefore && (
        <SelectableListItem
          itemId={SidePanelNavigationItemActions.ADD_BEFORE}
          onEnter={onAddBefore}
        >
          <CommandMenuItem
            Icon={IconRowInsertTop}
            label={t`Tambah item menu sebelum`}
            id={SidePanelNavigationItemActions.ADD_BEFORE}
            onClick={onAddBefore}
          />
        </SelectableListItem>
      )}
      {onAddAfter && (
        <SelectableListItem
          itemId={SidePanelNavigationItemActions.ADD_AFTER}
          onEnter={onAddAfter}
        >
          <CommandMenuItem
            Icon={IconRowInsertBottom}
            label={t`Tambah item menu sesudah`}
            id={SidePanelNavigationItemActions.ADD_AFTER}
            onClick={onAddAfter}
          />
        </SelectableListItem>
      )}
      <SelectableListItem
        itemId={SidePanelNavigationItemActions.REMOVE}
        onEnter={onRemove}
      >
        <CommandMenuItem
          Icon={IconTrash}
          label={t`Hapus dari bilah sisi`}
          id={SidePanelNavigationItemActions.REMOVE}
          onClick={onRemove}
        />
      </SelectableListItem>
    </SidePanelGroup>
  );
};
