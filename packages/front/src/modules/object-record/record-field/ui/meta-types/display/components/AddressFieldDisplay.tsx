import { getEnabledAddressSubFields } from '@/object-metadata/utils/getEnabledAddressSubFields';
import { useAddressFieldDisplay } from '@/object-record/record-field/ui/meta-types/hooks/useAddressFieldDisplay';
import { TextDisplay } from '@/ui/field/display/components/TextDisplay';
import {
  type FieldMetadataSettingsMapping,
  type FieldMetadataType,
} from 'shared/types';
import { formatAddressDisplay } from '~/utils/formatAddressDisplay';

export const AddressFieldDisplay = () => {
  const { fieldValue, fieldDefinition } = useAddressFieldDisplay();
  const settings = fieldDefinition.metadata
    .settings as FieldMetadataSettingsMapping[FieldMetadataType.ADDRESS];

  const subFields = [...getEnabledAddressSubFields(settings)];

  const parsedFieldValue = formatAddressDisplay(fieldValue, subFields);
  return <TextDisplay text={parsedFieldValue} />;
};
