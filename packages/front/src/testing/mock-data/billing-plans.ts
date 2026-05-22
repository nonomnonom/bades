import type { ListPlansQuery } from '~/generated-metadata/graphql';

export const mockBillingPlans = {
  listPlans: [
    {
      __typename: 'BillingPlan',
      planKey: 'PRO',
      baseProducts: [
        {
          __typename: 'BillingLicensedProduct',
          name: 'Paket Pro',
          description: 'Untuk perangkat desa yang sedang berkembang',
          images: [],
          metadata: {
            __typename: 'BillingProductMetadata',
            productKey: 'BASE_PRODUCT',
            planKey: 'PRO',
            priceUsageBased: 'LICENSED',
          },
          prices: [
            {
              __typename: 'BillingPriceLicensed',
              priceId: 'bades-price-pro-monthly',
              unitAmount: 150000,
              recurringInterval: 'Month',
              priceUsageType: 'LICENSED',
              creditAmount: null,
            },
            {
              __typename: 'BillingPriceLicensed',
              priceId: 'bades-price-pro-yearly',
              unitAmount: 1500000,
              recurringInterval: 'Year',
              priceUsageType: 'LICENSED',
              creditAmount: null,
            },
          ],
        },
      ],
      resourceCreditProducts: [],
      meteredProducts: [
        {
          __typename: 'BillingMeteredProduct',
          name: 'Kredit Pemakaian - Pro',
          description: '',
          images: [],
          metadata: {
            __typename: 'BillingProductMetadata',
            productKey: 'RESOURCE_CREDIT',
            planKey: 'PRO',
            priceUsageBased: 'METERED',
          },
          prices: [
            {
              __typename: 'BillingPriceMetered',
              priceUsageType: 'METERED',
              recurringInterval: 'Month',
              priceId: 'bades-price-pro-resource-credit-monthly',
              tiers: [
                {
                  __typename: 'BillingPriceTier',
                  flatAmount: 0,
                  unitAmount: null,
                  upTo: 5000,
                },
                {
                  __typename: 'BillingPriceTier',
                  flatAmount: null,
                  unitAmount: null,
                  upTo: null,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      __typename: 'BillingPlan',
      planKey: 'ENTERPRISE',
      baseProducts: [
        {
          __typename: 'BillingLicensedProduct',
          name: 'Paket Organisasi',
          description: 'Untuk pemerintah desa skala besar',
          images: [],
          metadata: {
            __typename: 'BillingProductMetadata',
            productKey: 'BASE_PRODUCT',
            planKey: 'ENTERPRISE',
            priceUsageBased: 'LICENSED',
          },
          prices: [
            {
              __typename: 'BillingPriceLicensed',
              priceId: 'bades-price-enterprise-monthly',
              unitAmount: 250000,
              recurringInterval: 'Month',
              priceUsageType: 'LICENSED',
              creditAmount: null,
            },
            {
              __typename: 'BillingPriceLicensed',
              priceId: 'bades-price-enterprise-yearly',
              unitAmount: 2500000,
              recurringInterval: 'Year',
              priceUsageType: 'LICENSED',
              creditAmount: null,
            },
          ],
        },
      ],
      resourceCreditProducts: [],
      meteredProducts: [
        {
          __typename: 'BillingMeteredProduct',
          name: 'Kredit Pemakaian - Organisasi',
          description: '',
          images: [],
          metadata: {
            __typename: 'BillingProductMetadata',
            productKey: 'RESOURCE_CREDIT',
            planKey: 'ENTERPRISE',
            priceUsageBased: 'METERED',
          },
          prices: [
            {
              __typename: 'BillingPriceMetered',
              priceUsageType: 'METERED',
              recurringInterval: 'Month',
              priceId: 'bades-price-enterprise-resource-credit-monthly',
              tiers: [
                {
                  __typename: 'BillingPriceTier',
                  flatAmount: 0,
                  unitAmount: null,
                  upTo: 5000,
                },
                {
                  __typename: 'BillingPriceTier',
                  flatAmount: null,
                  unitAmount: null,
                  upTo: null,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as ListPlansQuery;
