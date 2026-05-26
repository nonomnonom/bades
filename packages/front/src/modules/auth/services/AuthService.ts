import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

import { loggerLink } from '@/apollo/utils/loggerLink';
import {
  type AuthTokenPair,
  RenewTokenDocument,
  type RenewTokenMutation,
  type RenewTokenMutationVariables,
} from '~/generated-metadata/graphql';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';

const isDebugMode = process.env.IS_DEBUG_MODE === 'true';

const logger = loggerLink(() => 'Bades-Refresh');

const renewTokenMutation = async (
  uri: string | undefined,
  refreshToken: string,
) => {
  const httpLink = new HttpLink({ uri });

  const client = new ApolloClient({
    link: ApolloLink.from([...(isDebugMode ? [logger] : []), httpLink]),
    cache: new InMemoryCache({}),
  });

  const result = await client.mutate<
    RenewTokenMutation,
    RenewTokenMutationVariables
  >({
    mutation: RenewTokenDocument,
    variables: {
      appToken: refreshToken,
    },
    fetchPolicy: 'network-only',
  });

  if (isUndefinedOrNull(result.data)) {
    throw new Error('Perpanjangan token mengembalikan data kosong');
  }

  return result.data;
};

export const renewToken = async (
  uri: string | undefined,
  tokenPair: AuthTokenPair | undefined | null,
) => {
  if (!tokenPair) {
    throw new Error('Refresh token tidak terdefinisi');
  }

  const data = await renewTokenMutation(uri, tokenPair.refreshToken.token);

  return data?.renewToken.tokens;
};
