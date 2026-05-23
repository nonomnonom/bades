import { useLingui } from '~/utils/i18n/badesI18n';
import { MenuItem } from 'ui/navigation';

export const RecordPickerNoRecordFoundMenuItem = () => {
  const { t } = useLingui();
  return (
    <MenuItem
      disabled
      text={t`Tidak ada data ditemukan`}
      accent="placeholder"
    />
  );
};
