import { type TokenExchangeResponse } from 'src/engine/core-modules/application/connection-provider/types/token-exchange-response.type';

export const parseTokenResponse = (
  json: Record<string, unknown>,
): TokenExchangeResponse => {
  const accessToken =
    typeof json.access_token === 'string' ? json.access_token : null;

  if (!accessToken) {
    throw new Error(
      `Endpoint token tidak mengembalikan access_token. Keys respons: ${Object.keys(json).join(', ')}`,
    );
  }

  return {
    accessToken,
    refreshToken:
      typeof json.refresh_token === 'string' ? json.refresh_token : null,
    scopes:
      typeof json.scope === 'string'
        ? json.scope.split(/[\s,]+/).filter(Boolean)
        : null,
  };
};
