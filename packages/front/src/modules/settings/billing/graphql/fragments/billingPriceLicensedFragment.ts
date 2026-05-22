import { gql } from '@apollo/client';

export const BILLING_PRICE_LICENSED_FRAGMENT = gql`
  fragment BillingPriceLicensedFragment on BillingPriceLicensed {
    priceId
    unitAmount
    recurringInterval
    priceUsageType
    creditAmount
  }
`;
