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
      placeholder={`Cari variabel konfigurasi`}
      value={value}
      onChange={onChange}
    />
  );
};
