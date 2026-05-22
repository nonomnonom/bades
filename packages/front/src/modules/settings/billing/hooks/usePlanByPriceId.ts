import { findOrThrow } from 'shared/utils';
import { usePlans } from './usePlans';

export const usePlanByPriceId = () => {
  const { listPlans } = usePlans();

  const getPlanByPriceId = (priceId: string) =>
    findOrThrow(
      listPlans(),
      (plan) =>
        plan.baseProducts.some((p) =>
          p.prices?.some((price) => price.priceId === priceId),
        ) ||
        plan.resourceCreditProducts.some((p) =>
          p.prices?.some((price) => price.priceId === priceId),
        ) ||
        plan.meteredProducts.some((p) =>
          p.prices?.some((price) => price.priceId === priceId),
        ),
    );

  return { getPlanByPriceId };
};
