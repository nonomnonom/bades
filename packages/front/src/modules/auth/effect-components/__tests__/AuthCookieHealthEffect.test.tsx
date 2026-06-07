import { render } from '@testing-library/react';

import { AuthCookieHealthEffect } from '@/auth/effect-components/AuthCookieHealthEffect';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { clearTokenPairCookie } from '@/auth/utils/sharedAuthCookieUtil';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { getDefaultStore } from 'jotai';
import { cookieStorage } from '~/utils/cookie-storage';

jest.mock('@/auth/utils/sharedAuthCookieUtil', () => ({
  clearTokenPairCookie: jest.fn(),
  withSharedAuthCookieAttributes: jest.fn((tokenPair) => tokenPair),
}));

jest.mock('~/utils/cookie-storage', () => ({
  cookieStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('AuthCookieHealthEffect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const store = getDefaultStore();

    store.set(domainConfigurationState.atom, {
      frontDomain: 'bades.id',
      defaultSubdomain: 'app',
    });
    store.set(isMultiWorkspaceEnabledState.atom, true);
    store.set(tokenPairState.atom, {
      accessOrWorkspaceAgnosticToken: {
        token: 'existing-token',
        expiresAt: '2099-01-01',
      },
      refreshToken: {
        token: 'refresh-token',
        expiresAt: '2099-01-01',
      },
    });
  });

  it('membersihkan cookie invalid saat boot', () => {
    jest.mocked(cookieStorage.getItem).mockReturnValue('{ invalid json');

    render(<AuthCookieHealthEffect />);

    expect(clearTokenPairCookie).toHaveBeenCalledWith('bades.id', true);
    expect(getDefaultStore().get(tokenPairState.atom)).toBeNull();
  });

  it('tidak membersihkan cookie yang valid', () => {
    jest.mocked(cookieStorage.getItem).mockReturnValue(
      JSON.stringify({
        accessOrWorkspaceAgnosticToken: {
          token: 'valid-token',
          expiresAt: '2099-01-01',
        },
        refreshToken: {
          token: 'refresh-token',
          expiresAt: '2099-01-01',
        },
      }),
    );

    render(<AuthCookieHealthEffect />);

    expect(clearTokenPairCookie).not.toHaveBeenCalled();
  });
});
