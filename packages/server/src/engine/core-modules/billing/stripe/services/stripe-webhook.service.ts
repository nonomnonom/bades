/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import type Stripe from 'stripe';

import { StripeSDKService } from 'src/engine/core-modules/billing/stripe/stripe-sdk/services/stripe-sdk.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
@Injectable()
export class StripeWebhookService {
  protected readonly logger = new Logger(StripeWebhookService.name);
  private stripe: Stripe;

  constructor(
    private readonly badesConfigService: BadesConfigService,
    private readonly stripeSDKService: StripeSDKService,
  ) {
    if (!this.badesConfigService.get('IS_BILLING_ENABLED')) {
      return;
    }
    this.stripe = this.stripeSDKService.getStripe(
      this.badesConfigService.get('BILLING_STRIPE_API_KEY'),
    );
  }

  constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.badesConfigService.get(
      'BILLING_STRIPE_WEBHOOK_SECRET',
    );

    const returnValue = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    return returnValue;
  }
}
