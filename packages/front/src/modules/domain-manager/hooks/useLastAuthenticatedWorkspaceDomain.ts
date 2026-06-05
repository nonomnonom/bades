import { getSharedAuthCookieAttributes } from '@/auth/utils/shared-auth-cookie.util';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { lastAuthenticatedWorkspaceDomainState } from '@/domain-manager/states/lastAuthenticatedWorkspaceDomainState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';

export const useLastAuthenticatedWorkspaceDomain = () => {
  const domainConfiguration = useAtomStateValue(domainConfigurationState);
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const setLastAuthenticatedWorkspaceDomain = useSetAtomState(
    lastAuthenticatedWorkspaceDomainState,
  );
  const setLastAuthenticateWorkspaceDomainWithCookieAttributes = (
    params: { workspaceId: string; workspaceUrl: string } | null,
  ) => {
    const cookieAttributes = getSharedAuthCookieAttributes(
      domainConfiguration.frontDomain,
      isMultiWorkspaceEnabled,
    );

    setLastAuthenticatedWorkspaceDomain({
      ...(params ? params : {}),
      ...(cookieAttributes ? { cookieAttributes } : {}),
    });
  };

  return {
    setLastAuthenticateWorkspaceDomain:
      setLastAuthenticateWorkspaceDomainWithCookieAttributes,
  };
};
