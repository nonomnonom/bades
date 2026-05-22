import { Controller, useFormContext } from 'react-hook-form';

import { useFieldMetadataItemById } from '@/object-metadata/hooks/useFieldMetadataItemById';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { SettingsOptionCardContentSelect } from '@/settings/components/SettingsOptions/SettingsOptionCardContentSelect';
import { canBeUnique } from '@/settings/data-model/fields/forms/utils/canBeUnique';
import { t } from '~/utils/i18n/badesI18n';
import { type FieldMetadataType } from 'shared/types';
import { IconKey } from 'ui/display';
import { Toggle } from 'ui/input';

type SettingsDataModelFieldIsUniqueFormValues = {
  isUnique: boolean;
};

type SettingsDataModelFieldIsUniqueFormProps = {
  objectNameSingular: string;
  fieldType: FieldMetadataType;
  existingFieldMetadataId: string;
  disabled?: boolean;
};

export const SettingsDataModelFieldIsUniqueForm = ({
  fieldType,
  existingFieldMetadataId,
  objectNameSingular,
  disabled = false,
}: SettingsDataModelFieldIsUniqueFormProps) => {
  const { control } =
    useFormContext<SettingsDataModelFieldIsUniqueFormValues>();

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { fieldMetadataItem } = useFieldMetadataItemById(
    existingFieldMetadataId,
  );

  const hasStandardUniqueIndex = objectMetadataItem.indexMetadatas.some(
    (index) =>
      index.isUnique &&
      !index.isCustom &&
      index.indexFieldMetadatas?.some(
        (field) => field.fieldMetadataId === existingFieldMetadataId,
      ),
  );

  if (
    !canBeUnique({
      type: fieldType,
      isCustom: fieldMetadataItem?.isCustom ?? true,
    })
  ) {
    return null;
  }

  return (
    <Controller
      name="isUnique"
      defaultValue={fieldMetadataItem?.isUnique || false}
      control={control}
      render={({ field: { onChange, value } }) => {
        const isUnique = value ?? false;

        return (
          <>
            <SettingsOptionCardContentSelect
              Icon={IconKey}
              title={t`Unik`}
              description={t`Mencegah nilai yang sama diterapkan ke data berbeda`}
            >
              <Toggle
                toggleSize="small"
                value={isUnique}
                onChange={(value) => onChange(value)}
                disabled={disabled || hasStandardUniqueIndex}
              />
            </SettingsOptionCardContentSelect>
          </>
        );
      }}
    />
  );
};
