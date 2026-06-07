import { render } from '@testing-library/react';

import { AuthTokenRefreshSyncEffect } from '@/auth/effect-components/AuthTokenRefreshSyncEffect';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { getDefaultStore } from 'jotai';
import { cookieStorage } from '~/utils/cookie-storage';

let onRefreshCompleteFromOtherTab: (() => void) | undefined;

jest.mock('@/auth/utils/sharedAuthCookieUtil', () => ({
  clearTokenPairCookie: jest.fn(),
  withSharedAuthCookieAttributes: jest.fn((tokenPair) => tokenPair),
}));

jest.mock('@/auth/utils/crossTabSignOut', () => ({
  subscribeToRefreshFromOtherTabs: (
    _onRefreshStart: () => void,
    onRefreshComplete: () => void,
  ) => {
    onRefreshCompleteFromOtherTab = onRefreshComplete;
    return () => {
      onRefreshCompleteFromOtherTab = undefined;
    };
  },
}));

jest.mock('~/utils/cookie-storage', () => ({
  cookieStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('AuthTokenRefreshSyncEffect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    onRefreshCompleteFromOtherTab = undefined;

    const store = getDefaultStore();

    store.set(domainConfigurationState.atom, {
      frontDomain: 'bades.id',
      defaultSubdomain: 'app',
    });
    store.set(isMultiWorkspaceEnabledState.atom, true);
    store.set(tokenPairState.atom, null);
  });

  it('sinkronkan atom dari cookie saat refresh selesai di tab lain', () => {
    jest.mocked(cookieStorage.getItem).mockReturnValue(
      JSON.stringify({
        accessOrWorkspaceAgnosticToken: {
          token: 'refreshed-token',
          expiresAt: '2099-01-01',
        },
        refreshToken: {
          token: 'new-refresh',
          expiresAt: '2099-01-01',
        },
      }),
    );

    render(<AuthTokenRefreshSyncEffect />);
    onRefreshCompleteFromOtherTab?.();

    expect(getDefaultStore().get(tokenPairState.atom)).toEqual(
      expect.objectContaining({
        accessOrWorkspaceAgnosticToken: expect.objectContaining({
          token: 'refreshed-token',
        }),
      }),
    );
  });
});
