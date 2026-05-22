import { Injectable } from '@nestjs/common';

import { google } from 'googleapis';
import { isDefined } from 'shared/utils';

import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import {
  ConnectedAccountRefreshAccessTokenException,
  ConnectedAccountRefreshAccessTokenExceptionCode,
} from 'src/engine/metadata-modules/connected-account/exceptions/connected-account-refresh-tokens.exception';
import { type ConnectedAccountTokens } from 'src/modules/connected-account/refresh-tokens-manager/services/connected-account-refresh-tokens.service';
import { parseGoogleOAuthError } from 'src/modules/connected-account/refresh-tokens-manager/drivers/google/utils/parse-google-oauth-error.util';

@Injectable()
export class GoogleAPIRefreshAccessTokenService {
  constructor(private readonly badesConfigService: BadesConfigService) {}

  async refreshTokens(refreshToken: string): Promise<ConnectedAccountTokens> {
    const oAuth2Client = new google.auth.OAuth2(
      this.badesConfigService.get('AUTH_GOOGLE_CLIENT_ID'),
      this.badesConfigService.get('AUTH_GOOGLE_CLIENT_SECRET'),
    );

    oAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    try {
      const { token } = await oAuth2Client.getAccessToken();

      if (!isDefined(token)) {
        throw new ConnectedAccountRefreshAccessTokenException(
          'Error refreshing Google tokens: Invalid refresh token',
          ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN,
        );
      }

      return {
        accessToken: token,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof ConnectedAccountRefreshAccessTokenException) {
        throw error;
      }

      throw parseGoogleOAuthError(error);
    }
  }
}
