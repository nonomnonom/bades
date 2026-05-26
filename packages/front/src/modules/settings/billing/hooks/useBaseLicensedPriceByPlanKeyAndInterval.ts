import { t } from '~/utils/i18n/badesI18n';
import {
  type SubscriptionInterval,
  type BillingPlanKey,
} from '~/generated-metadata/graphql';
import { findOrThrow } from 'shared/utils';
import { useBaseProductByPlanKey } from '@/settings/billing/hooks/useBaseProductByPlanKey';

export const useBaseLicensedPriceByPlanKeyAndInterval = () => {
  const { getBaseProductByPlanKey } = useBaseProductByPlanKey();

  const getBaseLicensedPriceByPlanKeyAndInterval = (
    planKey: BillingPlanKey,
    interval: SubscriptionInterval,
  ) => {
    const baseProduct = getBaseProductByPlanKey(planKey);

    if (!baseProduct.prices) throw new Error(t`Harga produk tidak ditentukan.`);

    return findOrThrow(
      baseProduct.prices,
      (price) => price.recurringInterval === interval,
      new Error(t`Harga langganan dasar tidak ditemukan`),
    );
  };

  return { getBaseLicensedPriceByPlanKeyAndInterval };
};
