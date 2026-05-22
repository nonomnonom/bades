import { t } from '@lingui/core/macro';
import { SearchInput } from 'ui/input';

type ConfigVariableSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const ConfigVariableSearchInput = ({
  value,
  onChange,
}: ConfigVariableSearchInputProps) => {
  return (
    <SearchInput
      placeholder={t`Cari variabel konfigurasi`}
      value={value}
      onChange={onChange}
    />
  );
};
