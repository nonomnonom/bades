import { isValidAuthTokenPair } from '@/apollo/utils/isValidAuthTokenPair';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { clearTokenPairCookie } from '@/auth/utils/sharedAuthCookieUtil';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useEffect } from 'react';
import { isDefined } from 'shared/utils';
import { cookieStorage } from '~/utils/cookie-storage';

export const AuthCookieHealthEffect = () => {
  const setTokenPair = useSetAtomState(tokenPairState);
  const domainConfiguration = useAtomStateValue(domainConfigurationState);
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );

  useEffect(() => {
    const stringTokenPair = cookieStorage.getItem('tokenPair');

    if (!isDefined(stringTokenPair)) {
      return;
    }

    let isValid = false;

    try {
      isValid = isValidAuthTokenPair(JSON.parse(stringTokenPair));
    } catch {
      isValid = false;
    }

    if (!isValid) {
      clearTokenPairCookie(
        domainConfiguration.frontDomain,
        isMultiWorkspaceEnabled,
      );
      setTokenPair(null);
    }
  }, [domainConfiguration.frontDomain, isMultiWorkspaceEnabled, setTokenPair]);

  return null;
};
