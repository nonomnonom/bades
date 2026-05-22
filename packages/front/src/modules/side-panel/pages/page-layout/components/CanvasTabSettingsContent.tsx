import { CommandMenuItem } from '@/command-menu/components/CommandMenuItem';
import { CommandMenuItemDropdown } from '@/command-menu/components/CommandMenuItemDropdown';
import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';
import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { CanvasTabWidgetVisibilityDropdownContent } from '@/side-panel/pages/page-layout/components/dropdown-content/CanvasTabWidgetVisibilityDropdownContent';
import { TAB_SETTINGS_SELECTABLE_ITEM_IDS } from '@/side-panel/pages/page-layout/constants/settings/TabSettingsSelectableItemIds';
import { useTranslatedVisibilityLabel } from '@/side-panel/pages/page-layout/hooks/useTranslatedVisibilityLabel';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'shared/utils';
import {
  AppTooltip,
  IconChevronLeft,
  IconChevronRight,
  IconEyeX,
  IconPinned,
  IconRefreshDot,
  IconTrash,
} from 'ui/display';

const RESET_TAB_TO_DEFAULT_MODAL_ID = 'reset-canvas-tab-to-default-modal';
const RESET_TAB_TO_DEFAULT_MENU_ITEM_ID =
  'reset-canvas-tab-to-default-menu-item';

type CanvasTabSettingsContentProps = {
  pageLayoutId: string;
  canvasWidget: PageLayoutWidget | undefined;
  canSetAsPinned: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  isResetToDefaultDisabled: boolean;
  canDelete: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSetAsPinned: () => void;
  onResetToDefault: () => void;
  onDelete: () => void;
};

export const CanvasTabSettingsContent = ({
  pageLayoutId,
  canvasWidget,
  canSetAsPinned,
  canMoveLeft,
  canMoveRight,
  isResetToDefaultDisabled,
  canDelete,
  onMoveLeft,
  onMoveRight,
  onSetAsPinned,
  onResetToDefault,
  onDelete,
}: CanvasTabSettingsContentProps) => {
  const { t } = useLingui();
  const { openModal } = useModal();

  const visibilityLabel = useTranslatedVisibilityLabel(
    canvasWidget?.conditionalAvailabilityExpression,
  );

  const handleResetToDefault = () => {
    if (isResetToDefaultDisabled) {
      return;
    }
    openModal(RESET_TAB_TO_DEFAULT_MODAL_ID);
  };

  const selectableItemIds = [
    ...(canSetAsPinned ? [TAB_SETTINGS_SELECTABLE_ITEM_IDS.SET_AS_PINNED] : []),
    ...(canMoveLeft ? [TAB_SETTINGS_SELECTABLE_ITEM_IDS.MOVE_LEFT] : []),
    ...(canMoveRight ? [TAB_SETTINGS_SELECTABLE_ITEM_IDS.MOVE_RIGHT] : []),
    ...(isDefined(canvasWidget)
      ? [TAB_SETTINGS_SELECTABLE_ITEM_IDS.VISIBILITY_RESTRICTION]
      : []),
    TAB_SETTINGS_SELECTABLE_ITEM_IDS.RESET_TO_DEFAULT,
    ...(canDelete ? [TAB_SETTINGS_SELECTABLE_ITEM_IDS.DELETE] : []),
  ];

  return (
    <>
      <SidePanelList selectableItemIds={selectableItemIds}>
        <SidePanelGroup heading={t`Tata letak`}>
          {canSetAsPinned && (
            <SelectableListItem
              itemId={TAB_SETTINGS_SELECTABLE_ITEM_IDS.SET_AS_PINNED}
              onEnter={onSetAsPinned}
            >
              <CommandMenuItem
                id={TAB_SETTINGS_SELECTABLE_ITEM_IDS.SET_AS_PINNED}
                Icon={IconPinned}
                label={t`Sematkan tab`}
                onClick={onSetAsPinned}
              />
            </SelectableListItem>
          )}
          {canMoveLeft && (
            <SelectableListItem
              itemId={TAB_SETTINGS_SELECTABLE_ITEM_IDS.MOVE_LEFT}
              onEnter={onMoveLeft}
            >
              <CommandMenuItem
                id={TAB_SETTINGS_SELECTABLE_ITEM_IDS.MOVE_LEFT}
                Icon={IconChevronLeft}
                label={t`Geser ke kiri`}
                onClick={onMoveLeft}
              />
            </SelectableListItem>
          )}
          {canMoveRight && (
            <SelectableListItem
              itemId={TAB_SETTINGS_SELECTABLE_ITEM_IDS.MOVE_RIGHT}
              onEnter={onMoveRight}
            >
              <CommandMenuItem
                id={TAB_SETTINGS_SELECTABLE_ITEM_IDS.MOVE_RIGHT}
                Icon={IconChevronRight}
                label={t`Geser ke kanan`}
                onClick={onMoveRight}
              />
            </SelectableListItem>
          )}
        </SidePanelGroup>
        <SidePanelGroup heading={t`Kelola`}>
          {isDefined(canvasWidget) && (
            <SelectableListItem
              itemId={TAB_SETTINGS_SELECTABLE_ITEM_IDS.VISIBILITY_RESTRICTION}
            >
              <CommandMenuItemDropdown
                id={TAB_SETTINGS_SELECTABLE_ITEM_IDS.VISIBILITY_RESTRICTION}
                label={t`Pembatasan visibilitas`}
                Icon={IconEyeX}
                dropdownId={
                  TAB_SETTINGS_SELECTABLE_ITEM_IDS.VISIBILITY_RESTRICTION
                }
                dropdownComponents={
                  <DropdownContent>
                    <CanvasTabWidgetVisibilityDropdownContent
                      widgetId={canvasWidget.id}
                      currentExpression={
                        canvasWidget.conditionalAvailabilityExpression
                      }
                      pageLayoutId={pageLayoutId}
                    />
                  </DropdownContent>
                }
                dropdownPlacement="bottom-end"
                description={visibilityLabel}
                contextualTextPosition="right"
              />
            </SelectableListItem>
          )}
          <div id={RESET_TAB_TO_DEFAULT_MENU_ITEM_ID}>
            <SelectableListItem
              itemId={TAB_SETTINGS_SELECTABLE_ITEM_IDS.RESET_TO_DEFAULT}
              onEnter={handleResetToDefault}
            >
              <CommandMenuItem
                id={TAB_SETTINGS_SELECTABLE_ITEM_IDS.RESET_TO_DEFAULT}
                Icon={IconRefreshDot}
                label={t`Kembalikan ke default`}
                onClick={handleResetToDefault}
                disabled={isResetToDefaultDisabled}
              />
            </SelectableListItem>
          </div>
          {isResetToDefaultDisabled && (
            <AppTooltip
              anchorSelect={`#${RESET_TAB_TO_DEFAULT_MENU_ITEM_ID}`}
              content={t`Tidak ada konfigurasi default untuk tab ini`}
              noArrow
              place="bottom"
            />
          )}
          {canDelete && (
            <SelectableListItem
              itemId={TAB_SETTINGS_SELECTABLE_ITEM_IDS.DELETE}
              onEnter={onDelete}
            >
              <CommandMenuItem
                id={TAB_SETTINGS_SELECTABLE_ITEM_IDS.DELETE}
                Icon={IconTrash}
                label={t`Hapus`}
                onClick={onDelete}
              />
            </SelectableListItem>
          )}
        </SidePanelGroup>
      </SidePanelList>
      <ConfirmationModal
        modalInstanceId={RESET_TAB_TO_DEFAULT_MODAL_ID}
        title={t`Kembalikan ke default`}
        subtitle={t`Semua perubahan pada tab dan widget-nya akan dibatalkan. Mode edit akan ditutup dan halaman akan dimuat ulang. Tindakan ini tidak dapat diurungkan.`}
        onConfirmClick={onResetToDefault}
        confirmButtonText={t`Kembalikan`}
        confirmButtonAccent="danger"
      />
    </>
  );
};
