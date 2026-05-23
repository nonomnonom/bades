import { getVisibilityLabel } from '@/side-panel/pages/page-layout/utils/getVisibilityLabel';
import { useLingui } from '~/utils/i18n/badesI18n';

export const useTranslatedVisibilityLabel = (
  expression: string | null | undefined,
): string => {
  const { t } = useLingui();

  return getVisibilityLabel(expression, {
    anyDevice: t`Semua perangkat`,
    mobile: t`Seluler`,
    desktop: t`Desktop`,
  });
};
