/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import type Stripe from 'stripe';

import { StripeSDKService } from 'src/engine/core-modules/billing/stripe/stripe-sdk/services/stripe-sdk.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class StripeProductService {
  protected readonly logger = new Logger(StripeProductService.name);
  private readonly stripe: Stripe;

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

  async getAllProducts() {
    const products = await this.stripe.products.list({
      active: true,
      limit: 100,
    });

    return products.data;
  }
}
