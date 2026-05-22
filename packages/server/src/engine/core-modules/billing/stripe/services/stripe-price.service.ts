/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import type Stripe from 'stripe';

import { StripeSDKService } from 'src/engine/core-modules/billing/stripe/stripe-sdk/services/stripe-sdk.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class StripePriceService {
  protected readonly logger = new Logger(StripePriceService.name);
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

  async getPriceByPriceId(priceId: string) {
    return await this.stripe.prices.retrieve(priceId, {
      expand: ['data.currency_options', 'data.tiers'],
    });
  }

  async getPricesByProductId(productId: string) {
    const prices = await this.stripe.prices.list({
      product: productId,
      type: 'recurring',
      limit: 100,
      expand: ['data.currency_options', 'data.tiers'],
    });

    return prices.data;
  }
}
