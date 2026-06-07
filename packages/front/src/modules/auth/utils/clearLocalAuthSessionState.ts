import { getDefaultStore } from 'jotai';

import { currentUserState } from '@/auth/states/currentUserState';
import { currentUserWorkspaceState } from '@/auth/states/currentUserWorkspaceState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { clearTokenPairCookie } from '@/auth/utils/sharedAuthCookieUtil';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { workspacePublicDataState } from '@/auth/states/workspacePublicDataState';

export const clearLocalAuthSessionState = (): void => {
  const store = getDefaultStore();
  const domainConfiguration = store.get(domainConfigurationState.atom);
  const isMultiWorkspaceEnabled = store.get(isMultiWorkspaceEnabledState.atom);

  // Bersihkan cookie token — coba semua varian domain/path/secure
  clearTokenPairCookie(
    domainConfiguration.frontDomain,
    isMultiWorkspaceEnabled,
  );

  // Bersihkan juga semua domain alternatif umum untuk jaga-jaga
  // ada cookie orphan dari sesi sebelumnya dengan konfigurasi domain berbeda
  const allPossibleDomains = [
    window.location.hostname,
    window.location.hostname.replace(/^[^.]+\./, ''), // domain tingkat 2 (mis. bades.local)
  ];

  for (const domain of allPossibleDomains) {
    if (domain && domain !== domainConfiguration.frontDomain) {
      clearTokenPairCookie(domain, true);
    }
  }

  // Reset semua state auth di atom
  store.set(tokenPairState.atom, null);
  store.set(currentUserState.atom, null);
  store.set(currentWorkspaceMemberState.atom, null);
  store.set(currentWorkspaceState.atom, null);
  store.set(currentUserWorkspaceState.atom, null);
  store.set(workspacePublicDataState.atom, null);
};
