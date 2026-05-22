import { VISIBILITY_ANY_DEVICE } from '@/side-panel/pages/page-layout/constants/VisibilityAnyDevice';
import { VISIBILITY_DESKTOP } from '@/side-panel/pages/page-layout/constants/VisibilityDesktop';
import { VISIBILITY_MOBILE } from '@/side-panel/pages/page-layout/constants/VisibilityMobile';
import { useLingui } from '@lingui/react/macro';

export const useVisibilityLabels = (): Record<string, string> => {
  const { t } = useLingui();

  return {
    [VISIBILITY_ANY_DEVICE]: t`Semua perangkat`,
    [VISIBILITY_MOBILE]: t`Seluler`,
    [VISIBILITY_DESKTOP]: t`Desktop`,
  };
};
