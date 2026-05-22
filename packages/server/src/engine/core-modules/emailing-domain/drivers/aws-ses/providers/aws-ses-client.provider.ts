import { Injectable } from '@nestjs/common';

import {
  SESv2Client as SESClient,
  type SESv2ClientConfig as SESClientConfig,
} from '@aws-sdk/client-sesv2';

import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class AwsSesClientProvider {
  private sesClient: SESClient | null = null;

  constructor(private readonly badesConfigService: BadesConfigService) {}

  public getSESClient(): SESClient {
    if (!this.sesClient) {
      const config: SESClientConfig = {
        region: this.badesConfigService.get('AWS_SES_REGION'),
      };

      const accessKeyId = this.badesConfigService.get('AWS_SES_ACCESS_KEY_ID');
      const secretAccessKey = this.badesConfigService.get(
        'AWS_SES_SECRET_ACCESS_KEY',
      );
      const sessionToken = this.badesConfigService.get(
        'AWS_SES_SESSION_TOKEN',
      );

      if (accessKeyId && secretAccessKey && sessionToken) {
        config.credentials = {
          accessKeyId,
          secretAccessKey,
          sessionToken,
        };
      }

      this.sesClient = new SESClient(config);
    }

    return this.sesClient;
  }
}
