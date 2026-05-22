import { getVisibilityLabel } from '@/side-panel/pages/page-layout/utils/getVisibilityLabel';
import { useLingui } from '@lingui/react/macro';

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
