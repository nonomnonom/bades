import { getDefaultStore } from 'jotai';
import omit from 'lodash.omit';
import { isDefined } from 'shared/utils';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { type AuthTokenPair } from '~/generated-metadata/graphql';
import { cookieStorage } from '~/utils/cookie-storage';
import { isValidAuthTokenPair } from './isValidAuthTokenPair';

const parseStoredTokenPair = (
  stringTokenPair: string,
): AuthTokenPair | undefined => {
  try {
    const parsedTokenPair = JSON.parse(stringTokenPair);

    if (!isValidAuthTokenPair(parsedTokenPair)) {
      cookieStorage.removeItem('tokenPair');
      return undefined;
    }

    return parsedTokenPair;
  } catch {
    cookieStorage.removeItem('tokenPair');
    return undefined;
  }
};

const getTokenPairFromAtom = (): AuthTokenPair | undefined => {
  const tokenPairFromAtom = getDefaultStore().get(tokenPairState.atom);

  if (!isDefined(tokenPairFromAtom)) {
    return undefined;
  }

  const tokenPairWithoutCookieAttributes =
    'cookieAttributes' in tokenPairFromAtom
      ? (omit(tokenPairFromAtom, ['cookieAttributes']) as AuthTokenPair)
      : tokenPairFromAtom;

  if (!isValidAuthTokenPair(tokenPairWithoutCookieAttributes)) {
    return undefined;
  }

  return tokenPairWithoutCookieAttributes;
};

export const getTokenPair = (): AuthTokenPair | undefined => {
  const stringTokenPair = cookieStorage.getItem('tokenPair');

  if (isDefined(stringTokenPair)) {
    const parsedTokenPair = parseStoredTokenPair(stringTokenPair);

    if (isDefined(parsedTokenPair)) {
      return parsedTokenPair;
    }
  }

  const tokenPairFromAtom = getTokenPairFromAtom();

  if (isDefined(tokenPairFromAtom)) {
    return tokenPairFromAtom;
  }

  // tokenPair tidak tersedia di cookie maupun atom — normal saat user belum login

  return undefined;
};
