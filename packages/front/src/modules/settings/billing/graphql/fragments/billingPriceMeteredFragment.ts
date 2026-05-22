import { gql } from '@apollo/client';

export const BILLING_PRICE_METERED_FRAGMENT = gql`
  fragment BillingPriceMeteredFragment on BillingPriceMetered {
    priceUsageType
    recurringInterval
    priceId
    tiers {
      flatAmount
      unitAmount
      upTo
    }
  }
`;
