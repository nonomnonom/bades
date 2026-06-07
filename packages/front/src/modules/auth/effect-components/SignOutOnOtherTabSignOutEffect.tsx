import { useAuth } from '@/auth/hooks/useAuth';
import { clearLocalAuthSessionState } from '@/auth/utils/clearLocalAuthSessionState';
import {
  subscribeToSessionInvalidatedFromOtherTabs,
  subscribeToSignOutFromOtherTabs,
} from '@/auth/utils/crossTabSignOut';
import { useEffect } from 'react';

export const SignOutOnOtherTabSignOutEffect = () => {
  const { clearSession } = useAuth();

  useEffect(() => {
    const unsubscribeSignOut = subscribeToSignOutFromOtherTabs(() => {
      clearSession();
    });

    const unsubscribeSessionInvalidated =
      subscribeToSessionInvalidatedFromOtherTabs(() => {
        clearLocalAuthSessionState();
      });

    return () => {
      unsubscribeSignOut();
      unsubscribeSessionInvalidated();
    };
  }, [clearSession]);

  return null;
};
