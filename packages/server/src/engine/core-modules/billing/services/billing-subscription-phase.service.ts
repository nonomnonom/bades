/* @license Enterprise */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { findOrThrow, isDefined } from 'shared/utils';
import { type Repository } from 'typeorm';

import { type BillingSubscriptionSchedulePhaseDTO } from 'src/engine/core-modules/billing/dtos/billing-subscription-schedule-phase.dto';
import { BillingPriceEntity } from 'src/engine/core-modules/billing/entities/billing-price.entity';
import { BillingPlanService } from 'src/engine/core-modules/billing/services/billing-plan.service';
import { BillingPriceService } from 'src/engine/core-modules/billing/services/billing-price.service';
import { type SubscriptionPrices } from 'src/engine/core-modules/billing/services/billing-subscription-update.service';

@Injectable()
export class BillingSubscriptionPhaseService {
  constructor(
    @InjectRepository(BillingPriceEntity)
    private readonly billingPriceRepository: Repository<BillingPriceEntity>,
    private readonly billingPlanService: BillingPlanService,
    private readonly billingPriceService: BillingPriceService,
  ) {}

  async getDetailsFromPhase(phase: BillingSubscriptionSchedulePhaseDTO) {
    const meteredPrice = await this.billingPriceRepository.findOneOrFail({
      where: {
        priceId: findOrThrow(
          phase.items,
          ({ quantity }) => !isDefined(quantity),
        ).price,
      },
    });

    const { quantity, price: licensedItemPriceId } = findOrThrow(
      phase.items,
      ({ quantity }) => isDefined(quantity),
    );

    const licensedPrice = await this.billingPriceRepository.findOneOrFail({
      where: {
        priceId: licensedItemPriceId,
      },
    });

    const plan = await this.billingPlanService.getPlanByPriceId(
      meteredPrice.priceId,
    );

    if (!isDefined(quantity)) {
      throw new Error('Quantity tidak terdefinisi dalam phase');
    }

    return {
      plan,
      meteredPrice,
      licensedPrice,
      quantity,
      interval: meteredPrice.interval,
    };
  }

  toPhaseUpdateParams(phase: BillingSubscriptionSchedulePhaseDTO): {
    start_date: number;
    end_date?: number;
    proration_behavior: string;
    items: Array<{ price: string; quantity?: number }>;
  } {
    return {
      start_date: phase.start_date,
      end_date: phase.end_date ?? undefined,
      items: (phase.items || []).map((it) => ({
        price: it.price,
        quantity: it.quantity ?? undefined,
      })),
      proration_behavior: 'none',
    };
  }

  buildPhaseUpdateParams({
    toUpdatePrices,
    startDate,
    endDate,
  }: {
    toUpdatePrices: SubscriptionPrices;
    startDate: number;
    endDate: number | undefined;
  }): BillingSubscriptionSchedulePhaseDTO {
    return {
      start_date: startDate,
      end_date: endDate ?? 0,
      items: [
        {
          price: toUpdatePrices.licensedPriceId,
          quantity: toUpdatePrices.seats,
        },
        { price: toUpdatePrices.resourceCreditPriceId, quantity: 1 },
      ],
    };
  }

  getLicensedPriceIdAndQuantityFromPhase(
    phase: BillingSubscriptionSchedulePhaseDTO,
  ): {
    price: string;
    quantity: number;
  } {
    const licensedItem = findOrThrow(phase.items, (i) => i.quantity != null);

    if (!licensedItem.price || !isDefined(licensedItem.quantity)) {
      throw new Error('Item produk berlisensi tidak lengkap dalam phase');
    }

    return {
      price: licensedItem.price,
      quantity: licensedItem.quantity!,
    };
  }

  getResourceCreditPriceIdFromPhase(
    phase: BillingSubscriptionSchedulePhaseDTO,
  ): string {
    const items = phase.items ?? [];
    const licensedPriceIdAndQuantity =
      this.getLicensedPriceIdAndQuantityFromPhase(phase);

    const resourceCreditItem = items.find(
      (item) =>
        item.price !== licensedPriceIdAndQuantity.price && item.quantity === 1,
    );

    if (!resourceCreditItem?.price) {
      throw new Error('Resource credit item tidak ditemukan dalam phase');
    }

    return resourceCreditItem.price;
  }

  async isSamePhaseSignature(
    a: BillingSubscriptionSchedulePhaseDTO,
    b: BillingSubscriptionSchedulePhaseDTO,
  ): Promise<boolean> {
    try {
      const phaseALicensed = this.getLicensedPriceIdAndQuantityFromPhase(a);
      const phaseBLicensed = this.getLicensedPriceIdAndQuantityFromPhase(b);
      const phaseAResourceCredit = this.getResourceCreditPriceIdFromPhase(a);
      const phaseBResourceCredit = this.getResourceCreditPriceIdFromPhase(b);

      return (
        phaseALicensed.price === phaseBLicensed.price &&
        phaseALicensed.quantity === phaseBLicensed.quantity &&
        phaseAResourceCredit === phaseBResourceCredit
      );
    } catch {
      return false;
    }
  }
}
