import { MenuItem } from 'ui/navigation';

import { useLingui } from '@lingui/react/macro';

export const RecordPickerNoRecordFoundMenuItem = () => {
  const { t } = useLingui();
  return <MenuItem disabled text={""No records found"} accent="placeholder" />;
};
