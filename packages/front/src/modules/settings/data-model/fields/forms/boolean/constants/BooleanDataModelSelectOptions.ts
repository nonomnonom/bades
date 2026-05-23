import { msg } from '~/utils/i18n/badesI18n';
import { IconCheck, IconX } from 'ui/display';

export const BOOLEAN_DATA_MODEL_SELECT_OPTIONS = [
  {
    value: true,
    label: msg`Ya`,
    Icon: IconCheck,
  },
  {
    value: false,
    label: msg`Tidak`,
    Icon: IconX,
  },
];
