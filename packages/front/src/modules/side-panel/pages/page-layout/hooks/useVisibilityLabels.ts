import { VISIBILITY_ANY_DEVICE } from '@/side-panel/pages/page-layout/constants/VisibilityAnyDevice';
import { VISIBILITY_DESKTOP } from '@/side-panel/pages/page-layout/constants/VisibilityDesktop';
import { VISIBILITY_MOBILE } from '@/side-panel/pages/page-layout/constants/VisibilityMobile';
export const useVisibilityLabels = (): Record<string, string> => {
  return {
    [VISIBILITY_ANY_DEVICE]: `Semua perangkat`,
    [VISIBILITY_MOBILE]: `Seluler`,
    [VISIBILITY_DESKTOP]: `Desktop`,
  };
};
