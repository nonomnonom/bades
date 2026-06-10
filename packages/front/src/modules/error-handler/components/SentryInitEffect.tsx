import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { sentryConfigState } from '@/client-config/states/sentryConfigState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useEffect, useRef } from 'react';
import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'shared/utils';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

export const SentryInitEffect = () => {
  const sentryConfig = useAtomStateValue(sentryConfigState);

  const currentUser = useAtomStateValue(currentUserState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  // oxlint-disable-next-line bades/no-state-useref
  const isSentryInitializedRef = useRef(false);
  // oxlint-disable-next-line bades/no-state-useref
  const isSentryInitializingRef = useRef(false);
  // oxlint-disable-next-line bades/no-state-useref
  const isSentryUserDefinedRef = useRef(false);

  useEffect(() => {
    const initializeSentry = async () => {
      if (
        isNonEmptyString(sentryConfig?.dsn) &&
        !isSentryInitializedRef.current &&
        !isSentryInitializingRef.current
      ) {
        isSentryInitializingRef.current = true;

        try {
          const {
            init,
            browserTracingIntegration,
            replayIntegration,
            globalHandlersIntegration,
          } = await import('@sentry/react');

          init({
            environment: sentryConfig?.environment ?? undefined,
            release: sentryConfig?.release ?? undefined,
            dsn: sentryConfig?.dsn,
            integrations: [
              browserTracingIntegration({}),
              replayIntegration(),
              globalHandlersIntegration({
                onunhandledrejection: false, // handled in PromiseRejectionEffect
              }),
            ],
            tracePropagationTargets: [
              'localhost:3001',
              REACT_APP_SERVER_BASE_URL,
            ],
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
          });

          isSentryInitializedRef.current = true;
        } catch (error) {
          // oxlint-disable-next-line no-console
          console.error('Failed to initialize Sentry:', error);
        } finally {
          isSentryInitializingRef.current = false;
        }
      }
    };

    const updateSentryUser = async () => {
      if (
        isSentryInitializedRef.current &&
        isDefined(currentUser) &&
        !isSentryUserDefinedRef.current
      ) {
        try {
          const { setUser } = await import('@sentry/react');
          setUser({
            email: currentUser?.email,
            id: currentUser?.id,
            workspaceId: currentWorkspace?.id,
            workspaceMemberId: currentWorkspaceMember?.id,
          });
          isSentryUserDefinedRef.current = true;
        } catch (error) {
          // oxlint-disable-next-line no-console
          console.error('Failed to set Sentry user:', error);
        }
      } else if (!isDefined(currentUser) && isSentryInitializedRef.current) {
        try {
          const { setUser } = await import('@sentry/react');
          setUser(null);
        } catch (error) {
          // oxlint-disable-next-line no-console
          console.error('Failed to clear Sentry user:', error);
        }
      }
    };

    initializeSentry();
    updateSentryUser();
  }, [sentryConfig, currentUser, currentWorkspace, currentWorkspaceMember]);

  return <></>;
};
