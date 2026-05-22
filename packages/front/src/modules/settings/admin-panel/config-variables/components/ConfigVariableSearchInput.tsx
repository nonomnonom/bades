import { t } from '~/utils/i18n/badesI18n';
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
