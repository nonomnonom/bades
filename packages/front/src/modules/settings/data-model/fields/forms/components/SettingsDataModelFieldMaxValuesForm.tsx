import { Controller, useFormContext } from 'react-hook-form';

import { useFieldMetadataItemById } from '@/object-metadata/hooks/useFieldMetadataItemById';
import { SettingsOptionCardContentCounter } from '@/settings/components/SettingsOptions/SettingsOptionCardContentCounter';
import { type SettingsDataModelFieldMaxValuesFormValues } from '@/settings/data-model/fields/forms/utils/settingsDataModelFieldMaxValuesSchema';
import { useLingui } from '@lingui/react/macro';
import {
  MULTI_ITEM_FIELD_DEFAULT_MAX_VALUES,
  MULTI_ITEM_FIELD_MIN_MAX_VALUES,
} from 'shared/constants';
import {
  FieldMetadataType,
  type FieldMetadataMultiItemSettings,
} from 'shared/types';
import { IconNumber } from 'ui/display';

type SettingsDataModelFieldMaxValuesFormProps = {
  disabled?: boolean;
  existingFieldMetadataId: string;
  fieldType: FieldMetadataType;
};

export const SettingsDataModelFieldMaxValuesForm = ({
  disabled,
  existingFieldMetadataId,
  fieldType,
}: SettingsDataModelFieldMaxValuesFormProps) => {
  const { t } = useLingui();
  const { control } =
    useFormContext<SettingsDataModelFieldMaxValuesFormValues>();

  const { fieldMetadataItem } = useFieldMetadataItemById(
    existingFieldMetadataId,
  );

  let title: string | undefined;
  let description: string | undefined;

  switch (fieldType) {
    case FieldMetadataType.PHONES:
      title = t`Maks. nomor telepon`;
      description = t`Kemampuan menambahkan lebih dari satu nomor telepon`;
      break;
    case FieldMetadataType.EMAILS:
      title = t`Maks. alamat email`;
      description = t`Kemampuan menambahkan lebih dari satu alamat email`;
      break;
    case FieldMetadataType.LINKS:
      title = t`Maks. URL`;
      description = t`Kemampuan menambahkan lebih dari satu URL`;
      break;
    case FieldMetadataType.ARRAY:
      title = t`Maks. nilai`;
      description = t`Batasi berapa banyak nilai yang dapat ditambahkan ke kolom ini`;
      break;
    case FieldMetadataType.FILES:
      title = t`Maks. berkas`;
      description = t`Batasi berapa banyak berkas yang dapat dilampirkan ke kolom ini`;
      break;
    default:
      return null;
  }

  const existingSettings =
    (fieldMetadataItem?.settings as FieldMetadataMultiItemSettings) ?? {};

  return (
    <Controller
      name="settings"
      control={control}
      defaultValue={{
        ...existingSettings,
        maxNumberOfValues:
          existingSettings.maxNumberOfValues ??
          MULTI_ITEM_FIELD_DEFAULT_MAX_VALUES,
      }}
      render={({ field: { value, onChange } }) => {
        const currentSettings =
          (value as FieldMetadataMultiItemSettings | undefined) ?? {};

        const maxNumberOfValues =
          currentSettings.maxNumberOfValues ??
          MULTI_ITEM_FIELD_DEFAULT_MAX_VALUES;

        return (
          <SettingsOptionCardContentCounter
            Icon={IconNumber}
            title={title}
            description={description}
            disabled={disabled}
            minValue={MULTI_ITEM_FIELD_MIN_MAX_VALUES}
            value={maxNumberOfValues}
            onChange={(newValue) =>
              onChange({
                ...currentSettings,
                maxNumberOfValues: newValue,
              })
            }
          />
        );
      }}
    />
  );
};
