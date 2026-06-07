import { useImpersonationSession } from '@/auth/hooks/useImpersonationSession';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { isImpersonatingState } from '@/auth/states/isImpersonatingState';
import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isDefined } from 'shared/utils';
import { IconLogout } from 'ui/display';

export const InformationBannerIsImpersonating = () => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const isImpersonating = useAtomStateValue(isImpersonatingState);

  const { stopImpersonating } = useImpersonationSession();

  if (!isDefined(currentWorkspaceMember) || !isImpersonating) {
    return null;
  }

  const impersonatedUser = `${currentWorkspaceMember.name.firstName} ${currentWorkspaceMember.name.lastName} (${currentWorkspaceMember.userEmail})`;

  return (
    <InformationBanner
      componentInstanceId="information-banner-is-impersonating"
      message={`Masuk sebagai ${impersonatedUser}`}
      buttonTitle={`Hentikan peniruan identitas`}
      buttonIcon={IconLogout}
      buttonOnClick={stopImpersonating}
    />
  );
};
