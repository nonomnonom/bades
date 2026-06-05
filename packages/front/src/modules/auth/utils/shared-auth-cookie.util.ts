import type Cookies from 'js-cookie';

import { type AuthTokenPair } from '~/generated-metadata/graphql';
import { cookieStorage } from '~/utils/cookie-storage';

const TOKEN_PAIR_COOKIE_KEY = 'tokenPair';

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

  return { domain: `.${frontDomain}` };
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
  frontDomain: string | undefined,
  isMultiWorkspaceEnabled: boolean,
): void => {
  cookieStorage.removeItem(
    TOKEN_PAIR_COOKIE_KEY,
    getSharedAuthCookieAttributes(frontDomain, isMultiWorkspaceEnabled),
  );
};
