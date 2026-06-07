import { type FieldNumberVariant } from '@/object-record/record-field/ui/types/FieldMetadata';
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
  label: string;
  value: FieldNumberVariant;
};
export const NUMBER_DATA_MODEL_SELECT_OPTIONS = [
  {
    Icon: IconNumber9,
    label: `Angka`,
    value: 'number',
  },
  {
    Icon: IconLetterK,
    label: `Ringkas`,
    value: 'shortNumber',
  },
  {
    Icon: IconPercentage,
    label: `Persentase`,
    value: 'percentage',
  },
] as const satisfies Array<NumberDataModelSelectOptions>;
