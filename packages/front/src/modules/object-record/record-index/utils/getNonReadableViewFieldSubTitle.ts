import { t } from '~/utils/i18n/badesI18n';
import { type NonReadableViewFieldInfo } from '@/object-record/record-index/hooks/useHasCurrentViewNonReadableFields';
import { isDefined } from 'shared/utils';

export const getNonReadableViewFieldSubTitle = (
  nonReadableViewFieldInfo: NonReadableViewFieldInfo,
): string => {
  const usageLabel =
    nonReadableViewFieldInfo.usage === 'sort' ? t`sorting` : t`filtering`;

  if (isDefined(nonReadableViewFieldInfo.fieldLabel)) {
    return t`This view uses ${usageLabel} on field "${nonReadableViewFieldInfo.fieldLabel}" on "${nonReadableViewFieldInfo.objectLabel}" which is not accessible.`;
  }

  return t`This view uses ${usageLabel} on object "${nonReadableViewFieldInfo.objectLabel}" which is not accessible.`;
};
