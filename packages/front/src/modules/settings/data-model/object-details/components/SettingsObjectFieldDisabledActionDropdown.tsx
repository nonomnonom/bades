import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { GenericDropdownContentWidth } from '@/ui/layout/dropdown/constants/GenericDropdownContentWidth';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { t } from '~/utils/i18n/badesI18n';
import {
  IconArchiveOff,
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from 'ui/display';
import { LightIconButton } from 'ui/input';
import { MenuItem } from 'ui/navigation';
import { type FieldMetadataType } from '~/generated-metadata/graphql';

type SettingsObjectFieldInactiveActionDropdownProps = {
  isCustomField?: boolean;
  fieldType?: FieldMetadataType;
  onActivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  fieldMetadataItemId: string;
  readonly?: boolean;
};

export const SettingsObjectFieldInactiveActionDropdown = ({
  onActivate,
  readonly = false,
  fieldMetadataItemId,
  onDelete,
  onEdit,
  isCustomField,
}: SettingsObjectFieldInactiveActionDropdownProps) => {
  const dropdownId = `${fieldMetadataItemId}-settings-field-disabled-action-dropdown`;

  const { closeDropdown } = useCloseDropdown();

  const handleActivate = () => {
    onActivate();
    closeDropdown(dropdownId);
  };

  const handleDelete = () => {
    onDelete();
    closeDropdown(dropdownId);
  };

  const handleEdit = () => {
    onEdit();
    closeDropdown(dropdownId);
  };

  const isDeletable = isCustomField;

  return (
    <Dropdown
      dropdownId={dropdownId}
      clickableComponent={
        <LightIconButton
          aria-label={t`Opsi Kolom Nonaktif`}
          Icon={IconDotsVertical}
          accent="tertiary"
        />
      }
      dropdownComponents={
        <DropdownContent widthInPixels={GenericDropdownContentWidth.Narrow}>
          <DropdownMenuItemsContainer>
            <MenuItem
              text={isCustomField && !readonly ? t`Ubah` : t`Lihat`}
              LeftIcon={isCustomField ? IconPencil : IconEye}
              onClick={handleEdit}
            />
            {!readonly && (
              <MenuItem
                text={t`Aktifkan`}
                LeftIcon={IconArchiveOff}
                onClick={handleActivate}
              />
            )}
            {isDeletable && !readonly && (
              <MenuItem
                text={t`Hapus`}
                accent="danger"
                LeftIcon={IconTrash}
                onClick={handleDelete}
              />
            )}
          </DropdownMenuItemsContainer>
        </DropdownContent>
      }
    />
  );
};
