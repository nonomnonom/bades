import { type AuthTokenPair } from '~/generated-metadata/graphql';

export const isValidAuthTokenPair = (
  tokenPair: unknown,
): tokenPair is AuthTokenPair => {
  if (!tokenPair || typeof tokenPair !== 'object') {
    return false;
  }

  const obj = tokenPair as {
    accessOrWorkspaceAgnosticToken?: { token?: unknown };
    refreshToken?: { token?: unknown };
  };

  const accessToken = obj.accessOrWorkspaceAgnosticToken;
  const refreshToken = obj.refreshToken;

  return (
    typeof accessToken === 'object' &&
    accessToken !== null &&
    typeof accessToken.token === 'string' &&
    accessToken.token.trim().length > 0 &&
    typeof refreshToken === 'object' &&
    refreshToken !== null &&
    typeof refreshToken.token === 'string' &&
    refreshToken.token.trim().length > 0
  );
};
