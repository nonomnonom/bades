import { type ConfigVariableSourceFilter } from '@/settings/admin-panel/config-variables/types/ConfigVariableSourceFilter';
import { type ThemeColor } from 'ui/theme';

type ConfigVariableSourceOption = {
  value: ConfigVariableSourceFilter;
  label: string;
  color: ThemeColor | 'transparent';
};

export const CONFIG_VARIABLE_SOURCE_OPTIONS: ConfigVariableSourceOption[] = [
  { value: 'all', label: 'Semua Sumber', color: 'transparent' },
  { value: 'database', label: 'Basis Data', color: 'blue' },
  { value: 'environment', label: 'Lingkungan', color: 'green' },
  { value: 'default', label: 'Bawaan', color: 'gray' },
];
