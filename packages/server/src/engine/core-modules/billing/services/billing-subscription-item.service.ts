import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Raw, Repository } from 'typeorm';

import { differenceInDays } from 'date-fns';
import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import { BillingPriceEntity } from 'src/engine/core-modules/billing/entities/billing-price.entity';
import { BillingSubscriptionItemEntity } from 'src/engine/core-modules/billing/entities/billing-subscription-item.entity';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { BillingProductKey } from 'src/engine/core-modules/billing/enums/billing-product-key.enum';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import { isDefined } from 'shared/utils';

@Injectable()
export class BillingSubscriptionItemService {
  constructor(
    @InjectRepository(BillingSubscriptionItemEntity)
    private readonly billingSubscriptionItemRepository: Repository<BillingSubscriptionItemEntity>,
    private readonly badesConfigService: BadesConfigService,
  ) {}

  async getResourceCreditSubscriptionItemDetails(
    subscription: BillingSubscriptionEntity,
  ): Promise<{
    subscriptionItemId: string;
    productKey: BillingProductKey;
    creditAmount: number;
    freeTrialQuantity: number;
    unitPriceCents: number;
  } | null> {
    const item = await this.billingSubscriptionItemRepository.findOne({
      where: {
        billingSubscriptionId: subscription.id,
        billingProduct: {
          metadata: Raw((alias) => `${alias} @> :metadata::jsonb`, {
            metadata: JSON.stringify({
              productKey: BillingProductKey.RESOURCE_CREDIT,
            }),
          }),
        },
      },
      relations: ['billingProduct', 'billingProduct.billingPrices'],
    });

    if (!item) {
      return null;
    }

    const price = this.findMatchingPrice(item);

    const trialDuration =
      isDefined(subscription.trialEnd) && isDefined(subscription.trialStart)
        ? differenceInDays(subscription.trialEnd, subscription.trialStart)
        : 0;

    const trialWithCreditCardDuration = this.badesConfigService.get(
      'BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS',
    );

    return {
      subscriptionItemId: item.id,
      productKey: BillingProductKey.RESOURCE_CREDIT,
      creditAmount: Number(price.metadata?.credit_amount ?? 0),
      freeTrialQuantity: this.badesConfigService.get(
        trialDuration === trialWithCreditCardDuration
          ? 'BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD'
          : 'BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITHOUT_CREDIT_CARD',
      ),
      unitPriceCents: price.unitAmount ?? 0,
    };
  }

  private findMatchingPrice(
    item: BillingSubscriptionItemEntity,
  ): BillingPriceEntity {
    const matchingPrice = item.billingProduct.billingPrices.find(
      (price) => price.priceId === item.priceId,
    );

    if (!matchingPrice) {
      throw new BillingException(
        `Tidak dapat menemukan harga untuk produk ${item.productCode}`,
        BillingExceptionCode.BILLING_PRICE_NOT_FOUND,
      );
    }

    return matchingPrice;
  }
}
