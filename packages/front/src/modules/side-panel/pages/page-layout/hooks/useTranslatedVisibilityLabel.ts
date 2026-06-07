import { getVisibilityLabel } from '@/side-panel/pages/page-layout/utils/getVisibilityLabel';
export const useTranslatedVisibilityLabel = (
  expression: string | null | undefined,
): string => {
  return getVisibilityLabel(expression, {
    anyDevice: `Semua perangkat`,
    mobile: `Seluler`,
    desktop: `Desktop`,
  });
};
