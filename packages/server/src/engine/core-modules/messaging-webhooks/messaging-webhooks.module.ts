import { Module } from '@nestjs/common';

import { MessagingWebhooksController } from 'src/engine/core-modules/messaging-webhooks/messaging-webhooks.controller';
import { MessagingWebhookDispatcherService } from 'src/engine/core-modules/messaging-webhooks/services/messaging-webhook-dispatcher.service';
import { SnsSignatureVerifierService } from 'src/engine/core-modules/messaging-webhooks/services/sns-signature-verifier.service';
import { BadesConfigModule } from 'src/engine/core-modules/bades-config/bades-config.module';

@Module({
  imports: [BadesConfigModule],
  controllers: [MessagingWebhooksController],
  providers: [SnsSignatureVerifierService, MessagingWebhookDispatcherService],
})
export class MessagingWebhooksModule {}
