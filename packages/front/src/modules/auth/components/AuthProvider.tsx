import React, { useMemo } from 'react';

import { AuthContext } from '@/auth/contexts/AuthContext';
import { currentWorkspaceDeletedMembersState } from '@/auth/states/currentWorkspaceDeletedMembersState';
import { currentWorkspaceMembersState } from '@/auth/states/currentWorkspaceMembersState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const currentWorkspaceMembers = useAtomStateValue(
    currentWorkspaceMembersState,
  );
  const currentWorkspaceDeletedMembers = useAtomStateValue(
    currentWorkspaceDeletedMembersState,
  );

  const authValue = useMemo(
    () => ({
      currentWorkspaceMembers,
      currentWorkspaceDeletedMembers,
    }),
    [currentWorkspaceMembers, currentWorkspaceDeletedMembers],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
