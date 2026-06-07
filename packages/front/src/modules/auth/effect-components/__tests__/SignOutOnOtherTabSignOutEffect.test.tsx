import { render } from '@testing-library/react';

import { SignOutOnOtherTabSignOutEffect } from '@/auth/effect-components/SignOutOnOtherTabSignOutEffect';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentUserWorkspaceState } from '@/auth/states/currentUserWorkspaceState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { getDefaultStore } from 'jotai';

const mockClearSession = jest.fn();
let onSignOutFromOtherTab: (() => void) | undefined;
let onSessionInvalidatedFromOtherTab: (() => void) | undefined;

jest.mock('@/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    clearSession: mockClearSession,
  }),
}));

jest.mock('@/auth/utils/sharedAuthCookieUtil', () => ({
  clearTokenPairCookie: jest.fn(),
}));

jest.mock('@/auth/utils/crossTabSignOut', () => ({
  subscribeToSignOutFromOtherTabs: (callback: () => void) => {
    onSignOutFromOtherTab = callback;
    return () => {
      onSignOutFromOtherTab = undefined;
    };
  },
  subscribeToSessionInvalidatedFromOtherTabs: (callback: () => void) => {
    onSessionInvalidatedFromOtherTab = callback;
    return () => {
      onSessionInvalidatedFromOtherTab = undefined;
    };
  },
}));

describe('SignOutOnOtherTabSignOutEffect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    onSignOutFromOtherTab = undefined;
    onSessionInvalidatedFromOtherTab = undefined;

    const store = getDefaultStore();

    store.set(tokenPairState.atom, {
      accessOrWorkspaceAgnosticToken: {
        token: 'token',
        expiresAt: '2099-01-01',
      },
      refreshToken: {
        token: 'refresh',
        expiresAt: '2099-01-01',
      },
    });
    store.set(currentUserState.atom, { id: 'user-1' } as never);
    store.set(currentWorkspaceState.atom, { id: 'ws-1' } as never);
    store.set(currentWorkspaceMemberState.atom, { id: 'member-1' } as never);
    store.set(currentUserWorkspaceState.atom, { id: 'uw-1' } as never);
  });

  it('memanggil clearSession saat tab lain sign-out', () => {
    render(<SignOutOnOtherTabSignOutEffect />);

    onSignOutFromOtherTab?.();

    expect(mockClearSession).toHaveBeenCalledTimes(1);
  });

  it('membersihkan seluruh state sesi saat session-invalidated', () => {
    render(<SignOutOnOtherTabSignOutEffect />);

    onSessionInvalidatedFromOtherTab?.();

    const store = getDefaultStore();

    expect(store.get(tokenPairState.atom)).toBeNull();
    expect(store.get(currentUserState.atom)).toBeNull();
    expect(store.get(currentWorkspaceState.atom)).toBeNull();
    expect(store.get(currentWorkspaceMemberState.atom)).toBeNull();
    expect(store.get(currentUserWorkspaceState.atom)).toBeNull();
    expect(mockClearSession).not.toHaveBeenCalled();
  });
});
