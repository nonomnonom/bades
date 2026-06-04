import DigestFetch from 'digest-fetch';
import { getBasicAuthHeaders } from 'tsdav';
import { isDefined } from 'shared/utils';

import {
  asFetchWithPreconnect,
  type FetchWithPreconnect,
} from 'src/utils/fetch/asFetchWithPreconnect';

/**
 * Decorates a base fetch with HTTP Basic + Digest authentication.
 *
 * Delegates RFC 7235 / RFC 7616 challenge parsing, hash computation,
 * and 401-then-retry orchestration to `digest-fetch`
 */
export const createBasicDigestAuthFetch = (
  username: string,
  password: string,
  baseFetch: FetchWithPreconnect = globalThis.fetch,
): FetchWithPreconnect => {
  const digestClient = new DigestFetch(username, password);

  digestClient.getClient = async () => baseFetch;

  const { authorization: basicAuthorization } = getBasicAuthHeaders({
    username,
    password,
  });

  return asFetchWithPreconnect(async (input, init) => {
    const headers = new Headers(init?.headers);

    if (!headers.has('Authorization') && isDefined(basicAuthorization)) {
      headers.set('Authorization', basicAuthorization);
    }

    return digestClient.fetch(input, {
      ...init,
      headers,
    }) as Promise<Response>;
  }, baseFetch.preconnect?.bind(baseFetch));
};
