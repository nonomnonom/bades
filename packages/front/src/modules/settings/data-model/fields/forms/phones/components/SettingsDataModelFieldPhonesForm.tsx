import { Controller, useFormContext } from 'react-hook-form';

import { useFieldMetadataItemById } from '@/object-metadata/hooks/useFieldMetadataItemById';
import { phonesSchema as phonesFieldDefaultValueSchema } from '@/object-record/record-field/ui/types/guards/isFieldPhonesValue';
import { SettingsOptionCardContentSelect } from '@/settings/components/SettingsOptions/SettingsOptionCardContentSelect';
import { mergeSettingsSchemas } from '@/settings/data-model/fields/forms/utils/mergeSettingsSchema';
import { settingsDataModelFieldMaxValuesSchema } from '@/settings/data-model/fields/forms/utils/settingsDataModelFieldMaxValuesSchema';
import { settingsDataModelFieldOnClickActionSchema } from '@/settings/data-model/fields/forms/utils/settingsDataModelFieldOnClickActionSchema';
import { countryCodeToCallingCode } from '@/settings/data-model/fields/preview/utils/getPhonesFieldPreviewValue';
import { Select } from '@/ui/input/components/Select';
import { useCountries } from '@/ui/input/components/internal/hooks/useCountries';
import { useLingui } from '~/utils/i18n/badesI18n';
import type { CountryCode } from 'libphonenumber-js';
import { IconCircleOff, IconMap, type IconComponentProps } from 'ui/display';
import { z } from 'zod';
import { applySimpleQuotesToString } from '~/utils/string/applySimpleQuotesToString';
import { stripSimpleQuotesFromString } from '~/utils/string/stripSimpleQuotesFromString';

type SettingsDataModelFieldPhonesFormProps = {
  disabled?: boolean;
  defaultCountryCode?: string;
  existingFieldMetadataId: string;
};

export const settingsDataModelFieldPhonesFormSchema = z
  .object({
    defaultValue: phonesFieldDefaultValueSchema,
  })
  .merge(
    mergeSettingsSchemas(
      settingsDataModelFieldMaxValuesSchema,
      settingsDataModelFieldOnClickActionSchema,
    ),
  );

export type SettingsDataModelFieldPhonesFormValues = z.infer<
  typeof settingsDataModelFieldPhonesFormSchema
>;

export type CountryCodeOrEmpty = CountryCode | '';

export const SettingsDataModelFieldPhonesForm = ({
  disabled,
  existingFieldMetadataId,
}: SettingsDataModelFieldPhonesFormProps) => {
  const { t } = useLingui();
  const { control } = useFormContext<SettingsDataModelFieldPhonesFormValues>();

  const { fieldMetadataItem } = useFieldMetadataItemById(
    existingFieldMetadataId,
  );

  const countries = [
    { label: t`Tidak ada negara`, value: '', Icon: IconCircleOff },
    ...useCountries()
      .sort((a, b) => a.countryName.localeCompare(b.countryName))
      .map((country) => ({
        label: `${country.countryName} (+${country.callingCode})`,
        value: country.countryCode as CountryCodeOrEmpty,
        Icon: (props: IconComponentProps) =>
          country.Flag({ width: props.size, height: props.size }),
      })),
  ];
  const defaultDefaultValue = {
    primaryPhoneNumber: "''",
    primaryPhoneCountryCode: "''",
    primaryPhoneCallingCode: "''",
    additionalPhones: null,
  };
  const fieldMetadataItemDefaultValue = fieldMetadataItem?.defaultValue;

  return (
    <Controller
      name="defaultValue"
      defaultValue={{
        ...defaultDefaultValue,
        ...fieldMetadataItemDefaultValue,
      }}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <SettingsOptionCardContentSelect
            Icon={IconMap}
            title={t`Kode Negara Bawaan`}
            description={t`Kode negara bawaan untuk nomor telepon baru.`}
          >
            <Select<string>
              dropdownId="selectDefaultCountryCode"
              value={stripSimpleQuotesFromString(
                value?.primaryPhoneCountryCode,
              )}
              onChange={(newPhoneCountryCode) =>
                onChange({
                  ...value,
                  primaryPhoneCountryCode:
                    applySimpleQuotesToString(newPhoneCountryCode),
                  primaryPhoneCallingCode: applySimpleQuotesToString(
                    countryCodeToCallingCode(newPhoneCountryCode),
                  ),
                })
              }
              disabled={disabled}
              options={countries}
              selectSizeVariant="small"
              withSearchInput={true}
            />
          </SettingsOptionCardContentSelect>
        );
      }}
    />
  );
};
