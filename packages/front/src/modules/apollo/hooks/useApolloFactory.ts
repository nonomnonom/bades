import { InMemoryCache } from '@apollo/client';
import { useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ApolloFactory, type Options } from '@/apollo/services/apollo.factory';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { returnToPathState } from '@/auth/states/returnToPathState';
import { isValidReturnToPath } from '@/auth/utils/isValidReturnToPath';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { broadcastSessionInvalidatedToOtherTabs } from '@/auth/utils/crossTabSignOut';
import { clearLocalAuthSessionState } from '@/auth/utils/clearLocalAuthSessionState';
import { withSharedAuthCookieAttributes } from '@/auth/utils/sharedAuthCookieUtil';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { appVersionState } from '@/client-config/states/appVersionState';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { AppPath } from 'shared/types';
import { isDefined } from 'shared/utils';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { useUpdateEffect } from '~/hooks/useUpdateEffect';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const useApolloFactory = (options: Partial<Options> = {}) => {
  // oxlint-disable-next-line bades/no-state-useref
  const apolloRef = useRef<ApolloFactory | null>(null);

  const navigate = useNavigate();
  const setTokenPair = useSetAtomState(tokenPairState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const appVersion = useAtomStateValue(appVersionState);
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const setReturnToPath = useSetAtomState(returnToPathState);
  const domainConfiguration = useAtomStateValue(domainConfigurationState);
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const location = useLocation();

  // oxlint-disable-next-line bades/no-state-useref
  const authCookieConfigRef = useRef({
    frontDomain: domainConfiguration.frontDomain,
    isMultiWorkspaceEnabled,
  });
  authCookieConfigRef.current = {
    frontDomain: domainConfiguration.frontDomain,
    isMultiWorkspaceEnabled,
  };

  // oxlint-disable-next-line bades/no-state-useref
  const locationRef = useRef(location);
  locationRef.current = location;

  const { enqueueErrorSnackBar } = useSnackBar();

  const apolloClient = useMemo(() => {
    apolloRef.current = new ApolloFactory({
      uri: `${REACT_APP_SERVER_BASE_URL}/graphql`,
      cache: new InMemoryCache({
        typePolicies: {
          RemoteTable: {
            keyFields: ['name'],
          },
        },
      }),

      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
      devtools: { enabled: process.env.IS_DEBUG_MODE === 'true' },
      currentWorkspaceMember: currentWorkspaceMember,
      currentWorkspace: currentWorkspace,
      appVersion,
      onTokenPairChange: (tokenPair) => {
        const { frontDomain, isMultiWorkspaceEnabled: isMultiWorkspace } =
          authCookieConfigRef.current;

        setTokenPair(
          withSharedAuthCookieAttributes(
            tokenPair,
            frontDomain,
            isMultiWorkspace,
          ),
        );
      },
      onUnauthenticatedError: () => {
        clearLocalAuthSessionState();
        broadcastSessionInvalidatedToOtherTabs();

        const currentLocation = locationRef.current;

        if (
          !isMatchingLocation(currentLocation, AppPath.Verify) &&
          !isMatchingLocation(currentLocation, AppPath.SignInUp) &&
          !isMatchingLocation(currentLocation, AppPath.Invite) &&
          !isMatchingLocation(currentLocation, AppPath.ResetPassword)
        ) {
          const path = `${currentLocation.pathname}${currentLocation.search}${currentLocation.hash}`;

          if (isValidReturnToPath(path)) {
            setReturnToPath(path);
          }
          navigate(AppPath.SignInUp);
        }
      },
      onAppVersionMismatch: (message) => {
        enqueueErrorSnackBar({
          message,
          options: {
            dedupeKey: 'app-version-mismatch',
          },
        });
      },
      onPayloadTooLarge: (message) => {
        enqueueErrorSnackBar({
          message,
          options: {
            dedupeKey: 'payload-too-large',
          },
        });
      },
      extraLinks: [],
      isDebugMode: process.env.IS_DEBUG_MODE === 'true',
      // Override options
      ...options,
    });

    return apolloRef.current.getClient();
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setTokenPair,
    currentWorkspaceMember,
    currentWorkspace,
    appVersion,
    setReturnToPath,
    enqueueErrorSnackBar,
    navigate,
  ]);

  useUpdateEffect(() => {
    if (isDefined(apolloRef.current)) {
      apolloRef.current.updateWorkspaceMember(currentWorkspaceMember);
    }
  }, [currentWorkspaceMember]);

  useUpdateEffect(() => {
    if (isDefined(apolloRef.current)) {
      apolloRef.current.updateCurrentWorkspace(currentWorkspace);
    }
  }, [currentWorkspace]);

  useUpdateEffect(() => {
    if (isDefined(apolloRef.current)) {
      apolloRef.current.updateAppVersion(appVersion);
    }
  }, [appVersion]);

  return apolloClient;
};
