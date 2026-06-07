import { type NonReadableViewFieldInfo } from '@/object-record/record-index/hooks/useHasCurrentViewNonReadableFields';
import { isDefined } from 'shared/utils';

export const getNonReadableViewFieldSubTitle = (
  nonReadableViewFieldInfo: NonReadableViewFieldInfo,
): string => {
  const usageLabel =
    nonReadableViewFieldInfo.usage === 'sort' ? `pengurutan` : `penyaringan`;

  if (isDefined(nonReadableViewFieldInfo.fieldLabel)) {
    return `Tampilan ini menggunakan ${usageLabel} pada kolom "${nonReadableViewFieldInfo.fieldLabel}" di "${nonReadableViewFieldInfo.objectLabel}" yang tidak dapat diakses.`;
  }

  return `Tampilan ini menggunakan ${usageLabel} pada objek "${nonReadableViewFieldInfo.objectLabel}" yang tidak dapat diakses.`;
};
