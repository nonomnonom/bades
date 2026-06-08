import { isValidAuthTokenPair } from '@/apollo/utils/isValidAuthTokenPair';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { subscribeToRefreshFromOtherTabs } from '@/auth/utils/crossTabSignOut';
import {
  clearTokenPairCookie,
  withSharedAuthCookieAttributes,
} from '@/auth/utils/sharedAuthCookieUtil';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useEffect } from 'react';
import { type AuthTokenPair } from '~/generated-metadata/graphql';
import { cookieStorage } from '~/utils/cookie-storage';

const syncTokenPairFromCookie = ({
  setTokenPair,
  frontDomain,
  isMultiWorkspaceEnabled,
}: {
  setTokenPair: (value: AuthTokenPair | null) => void;
  frontDomain: string | undefined;
  isMultiWorkspaceEnabled: boolean;
}) => {
  const stringTokenPair = cookieStorage.getItem('tokenPair');

  if (!stringTokenPair) {
    setTokenPair(null);
    return;
  }

  try {
    const parsedTokenPair = JSON.parse(stringTokenPair);

    if (!isValidAuthTokenPair(parsedTokenPair)) {
      clearTokenPairCookie(frontDomain, isMultiWorkspaceEnabled);
      setTokenPair(null);
      return;
    }

    setTokenPair(
      withSharedAuthCookieAttributes(
        parsedTokenPair,
        frontDomain,
        isMultiWorkspaceEnabled,
      ),
    );
  } catch {
    clearTokenPairCookie(frontDomain, isMultiWorkspaceEnabled);
    setTokenPair(null);
  }
};

export const AuthTokenRefreshSyncEffect = () => {
  const setTokenPair = useSetAtomState(tokenPairState);
  const domainConfiguration = useAtomStateValue(domainConfigurationState);
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );

  useEffect(() => {
    return subscribeToRefreshFromOtherTabs(
      () => {},
      () => {
        syncTokenPairFromCookie({
          setTokenPair,
          frontDomain: domainConfiguration.frontDomain,
          isMultiWorkspaceEnabled,
        });
      },
    );
  }, [domainConfiguration.frontDomain, isMultiWorkspaceEnabled, setTokenPair]);

  return null;
};
