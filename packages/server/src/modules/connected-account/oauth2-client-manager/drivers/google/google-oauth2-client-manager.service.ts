import { Injectable, Logger } from '@nestjs/common';

import { google, type Auth } from 'googleapis';

import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class GoogleOAuth2ClientManagerService {
  constructor(
    private readonly badesConfigService: BadesConfigService,
    private readonly logger: Logger,
  ) {}

  public async getOAuth2Client(
    refreshToken: string,
  ): Promise<Auth.OAuth2Client> {
    const gmailClientId = this.badesConfigService.get('AUTH_GOOGLE_CLIENT_ID');
    const gmailClientSecret = this.badesConfigService.get(
      'AUTH_GOOGLE_CLIENT_SECRET',
    );

    try {
      const oAuth2Client = new google.auth.OAuth2(
        gmailClientId,
        gmailClientSecret,
      );

      oAuth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      return oAuth2Client;
    } catch (error) {
      this.logger.error(
        `Error in ${GoogleOAuth2ClientManagerService.name}`,
        error,
      );

      throw error;
    }
  }
}
