import { MenuItem } from 'ui/navigation';

export const RecordPickerNoRecordFoundMenuItem = () => {
  return (
    <MenuItem disabled text={`Tidak ada data ditemukan`} accent="placeholder" />
  );
};
