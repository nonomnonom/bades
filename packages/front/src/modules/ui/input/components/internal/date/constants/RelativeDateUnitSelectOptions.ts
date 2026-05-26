import { type RelativeDateFilterUnit } from 'shared/utils';

type RelativeDateUnitOption = {
  value: RelativeDateFilterUnit;
  label: string;
};

export const RELATIVE_DATE_UNITS_SELECT_OPTIONS: RelativeDateUnitOption[] = [
  { value: 'DAY', label: 'Hari' },
  { value: 'WEEK', label: 'Minggu' },
  { value: 'MONTH', label: 'Bulan' },
  { value: 'QUARTER', label: 'Kuartal' },
  { value: 'YEAR', label: 'Tahun' },
];
