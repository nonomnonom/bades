import type Cookies from 'js-cookie';

import { type AuthTokenPair } from '~/generated-metadata/graphql';
import { cookieStorage } from '~/utils/cookie-storage';

const TOKEN_PAIR_COOKIE_KEY = 'tokenPair';

const ROOT_PATH_ATTRIBUTES: Cookies.CookieAttributes = { path: '/' };

type TokenPairWithCookieAttributes = AuthTokenPair & {
  cookieAttributes?: Cookies.CookieAttributes;
};

// Browser menolak cookie dengan Domain=.localhost; pakai host-only cookie per subdomain.
export const isLocalDevelopmentFrontDomain = (frontDomain: string): boolean =>
  frontDomain === 'localhost' ||
  frontDomain === '127.0.0.1' ||
  frontDomain.endsWith('.localhost');

export const getSharedAuthCookieAttributes = (
  frontDomain: string | undefined,
  isMultiWorkspaceEnabled: boolean,
): Cookies.CookieAttributes | undefined => {
  if (!isMultiWorkspaceEnabled || !frontDomain) {
    return undefined;
  }

  if (isLocalDevelopmentFrontDomain(frontDomain)) {
    return undefined;
  }

  return { domain: `.${frontDomain}`, path: '/' };
};

export const withSharedAuthCookieAttributes = (
  tokenPair: AuthTokenPair,
  frontDomain: string | undefined,
  isMultiWorkspaceEnabled: boolean,
): TokenPairWithCookieAttributes => {
  const cookieAttributes = getSharedAuthCookieAttributes(
    frontDomain,
    isMultiWorkspaceEnabled,
  );

  if (!cookieAttributes) {
    return tokenPair;
  }

  return {
    ...tokenPair,
    cookieAttributes,
  };
};

export const clearTokenPairCookie = (
  frontDomain?: string,
  _isMultiWorkspaceEnabled?: boolean,
): void => {
  // Hapus cookie host-only dan varian domain bersama agar tidak tersisa
  // setelah logout / token invalid (mis. setelah reset DB atau ganti config).
  // Coba berbagai kombinasi untuk memastikan cookie benar-benar hilang,
  // termasuk varian yang mungkin dibuat oleh sesi dengan konfigurasi domain
  // berbeda atau dari versi Bades sebelumnya.

  // 1. Hapus host-only (tanpa domain) — path default
  cookieStorage.removeItem(TOKEN_PAIR_COOKIE_KEY);
  // 2. Hapus host-only dengan path eksplisit /
  cookieStorage.removeItem(TOKEN_PAIR_COOKIE_KEY, ROOT_PATH_ATTRIBUTES);

  // 3. Coba hapus dengan domain eksplisit (.frontDomain) jika tersedia
  if (frontDomain && !isLocalDevelopmentFrontDomain(frontDomain)) {
    cookieStorage.removeItem(TOKEN_PAIR_COOKIE_KEY, {
      domain: `.${frontDomain}`,
      path: '/',
    });
  }

  // 4. Selalu coba domain host itu sendiri (tanpa titik depan) — berguna
  //    saat cookie terlanjur ditulis dengan domain literal bukan .prefixed
  if (frontDomain) {
    cookieStorage.removeItem(TOKEN_PAIR_COOKIE_KEY, {
      domain: frontDomain,
      path: '/',
    });
  }
};

export { TOKEN_PAIR_COOKIE_KEY };
