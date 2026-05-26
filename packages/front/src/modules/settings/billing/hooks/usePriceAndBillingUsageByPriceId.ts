import { t } from '~/utils/i18n/badesI18n';

import { isDefined } from 'shared/utils';
import {
  type BillingPriceLicensed,
  type BillingPriceMetered,
  BillingUsageType,
} from '~/generated-metadata/graphql';
import { useAllBillingPrices } from './useAllBillingPrices';

export const usePriceAndBillingUsageByPriceId = () => {
  const { allBillingPrices } = useAllBillingPrices();

  const getPriceAndBillingUsageByPriceId = (
    priceId: string,
  ):
    | {
        price: BillingPriceLicensed;
        billingUsage: BillingUsageType.LICENSED;
      }
    | {
        price: BillingPriceMetered;
        billingUsage: BillingUsageType.METERED;
      } => {
    const licensed = allBillingPrices.find(
      (p) =>
        p.priceUsageType === BillingUsageType.LICENSED && p.priceId === priceId,
    ) as BillingPriceLicensed | undefined;

    if (isDefined(licensed))
      return { price: licensed, billingUsage: BillingUsageType.LICENSED };

    const metered = allBillingPrices.find(
      (p) =>
        p.priceUsageType === BillingUsageType.METERED && p.priceId === priceId,
    ) as BillingPriceMetered | undefined;
    if (isDefined(metered))
      return { price: metered, billingUsage: BillingUsageType.METERED };

    throw new Error(t`Harga tidak ditemukan`);
  };

  return { getPriceAndBillingUsageByPriceId };
};
