import { type FieldNumberVariant } from '@/object-record/record-field/ui/types/FieldMetadata';
import { msg } from '~/utils/i18n/badesI18n';
import { type MessageDescriptor } from '~/utils/i18n/badesI18n';
import { type ForwardRefExoticComponent, type RefAttributes } from 'react';
import {
  IconLetterK,
  IconNumber9,
  IconPercentage,
  type IconComponent,
  type IconComponentProps,
} from 'ui/display';

type NumberDataModelSelectOptions = {
  Icon: ForwardRefExoticComponent<
    IconComponentProps & RefAttributes<IconComponent>
  >;
  label: MessageDescriptor;
  value: FieldNumberVariant;
};
export const NUMBER_DATA_MODEL_SELECT_OPTIONS = [
  {
    Icon: IconNumber9,
    label: msg`Angka`,
    value: 'number',
  },
  {
    Icon: IconLetterK,
    label: msg`Ringkas`,
    value: 'shortNumber',
  },
  {
    Icon: IconPercentage,
    label: msg`Persentase`,
    value: 'percentage',
  },
] as const satisfies Array<NumberDataModelSelectOptions>;
