import { type RelativeDateFilterDirection } from 'shared/utils';

type RelativeDateDirectionOption = {
  value: RelativeDateFilterDirection;
  label: string;
};

export const RELATIVE_DATE_DIRECTION_SELECT_OPTIONS: RelativeDateDirectionOption[] =
  [
    { value: 'PAST', label: 'Lalu' },
    { value: 'THIS', label: 'Ini' },
    { value: 'NEXT', label: 'Depan' },
  ];
