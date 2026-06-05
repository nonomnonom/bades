import { type CookieAttributes } from 'js-cookie';

import { type AuthTokenPair } from '~/generated-metadata/graphql';
import { cookieStorage } from '~/utils/cookie-storage';

const TOKEN_PAIR_COOKIE_KEY = 'tokenPair';

type TokenPairWithCookieAttributes = AuthTokenPair & {
  cookieAttributes?: CookieAttributes;
};

export const getSharedAuthCookieAttributes = (
  frontDomain: string | undefined,
  isMultiWorkspaceEnabled: boolean,
): CookieAttributes | undefined => {
  if (!isMultiWorkspaceEnabled || !frontDomain) {
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
