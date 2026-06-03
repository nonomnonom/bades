import { styled } from '@linaria/react';
import { useMemo } from 'react';

import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { recordMapFieldMetadataIdState } from '@/object-record/record-map/states/recordMapFieldMetadataIdState';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { MenuItemSelect } from 'ui/navigation';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { themeCssVariables } from 'ui/theme-constants';

const StyledPickerBar = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledPickerLabel = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledPickerButton = styled.button`
  background: transparent;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
`;

type RecordMapAddressFieldPickerProps = {
  addressFields: FieldMetadataItem[];
};

// Dropdown sederhana untuk override field ADDRESS yang dipakai MAP view.
// Hanya di-render saat object punya lebih dari satu field ADDRESS aktif.
// Opsi "Otomatis (alamat pertama)" mengembalikan ke default (null) supaya
// hook `useRecordMapRecords` kembali memilih field ADDRESS pertama.
export const RecordMapAddressFieldPicker = ({
  addressFields,
}: RecordMapAddressFieldPickerProps) => {
  const [recordMapFieldMetadataId, setRecordMapFieldMetadataId] = useAtomState(
    recordMapFieldMetadataIdState,
  );

  const { closeDropdown } = useCloseDropdown();

  const selectedField = useMemo(
    () =>
      addressFields.find((field) => field.id === recordMapFieldMetadataId) ??
      null,
    [addressFields, recordMapFieldMetadataId],
  );

  const buttonLabel = selectedField
    ? selectedField.label
    : 'Otomatis (alamat pertama)';

  return (
    <StyledPickerBar>
      <StyledPickerLabel>Kolom alamat:</StyledPickerLabel>
      <Dropdown
        dropdownId="record-map-address-field-picker"
        clickableComponent={
          <StyledPickerButton type="button">{buttonLabel}</StyledPickerButton>
        }
        dropdownComponents={
          <DropdownContent>
            <DropdownMenuItemsContainer>
              <SelectableListItem
                itemId="auto"
                onEnter={() => {
                  setRecordMapFieldMetadataId(null);
                  closeDropdown();
                }}
              >
                <MenuItemSelect
                  selected={recordMapFieldMetadataId === null}
                  text="Otomatis (alamat pertama)"
                  onClick={() => {
                    setRecordMapFieldMetadataId(null);
                    closeDropdown();
                  }}
                />
              </SelectableListItem>
              {addressFields.map((field) => (
                <SelectableListItem
                  key={field.id}
                  itemId={field.id}
                  onEnter={() => {
                    setRecordMapFieldMetadataId(field.id);
                    closeDropdown();
                  }}
                >
                  <MenuItemSelect
                    selected={recordMapFieldMetadataId === field.id}
                    text={field.label}
                    onClick={() => {
                      setRecordMapFieldMetadataId(field.id);
                      closeDropdown();
                    }}
                  />
                </SelectableListItem>
              ))}
            </DropdownMenuItemsContainer>
          </DropdownContent>
        }
      />
    </StyledPickerBar>
  );
};
