import { i18n, type MessageDescriptor } from '~/utils/i18n/badesI18n';
import { isString } from '@sniptt/guards';
import { type Nullable } from 'shared/types';
import { isDefined } from 'shared/utils';

export const getCommandMenuItemLabel = (
  label: Nullable<string | MessageDescriptor>,
): string => {
  if (!isDefined(label)) {
    return '';
  }

  return isString(label) ? label : i18n._(label);
};
