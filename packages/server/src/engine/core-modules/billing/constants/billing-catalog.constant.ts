/* @license Enterprise */

import { BillingPlanKey } from 'src/engine/core-modules/billing/enums/billing-plan-key.enum';
import { BillingProductKey } from 'src/engine/core-modules/billing/enums/billing-product-key.enum';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { BillingUsageType } from 'src/engine/core-modules/billing/enums/billing-usage-type.enum';

/**
 * Katalog produk & harga billing Bades.
 *
 * Semua harga dalam IDR (Rupiah penuh, bukan sen) karena Midtrans memproses
 * transaksi dalam IDR. `productCode` dan `priceId` adalah slug internal Bades.
 */

export type BadesBillingPriceCatalogEntry = {
  /** Slug harga internal Bades, mis. `bades-price-pro-monthly`. */
  priceId: string;
  /** Nominal per periode dalam IDR penuh. */
  unitAmount: number;
  currency: 'IDR';
  interval: SubscriptionInterval;
  usageType: BillingUsageType;
};

export type BadesBillingProductCatalogEntry = {
  /** Kode produk internal Bades, mis. `bades-product-base`. */
  productCode: string;
  productKey: BillingProductKey;
  name: string;
  description: string;
  /** Harga per paket; produk RESOURCE_CREDIT memakai `BillingPlanKey`-agnostik. */
  prices: BadesBillingPriceCatalogEntry[];
};

const PRO_MONTHLY_IDR = 150_000;
const PRO_YEARLY_IDR = 1_500_000;

/**
 * Produk dasar langganan (paket bulanan/tahunan per workspace desa).
 */
export const BASE_PRODUCT: BadesBillingProductCatalogEntry = {
  productCode: 'bades-product-base',
  productKey: BillingProductKey.BASE_PRODUCT,
  name: 'Langganan Bades',
  description:
    'Langganan sistem informasi desa Bades untuk satu workspace perangkat desa.',
  prices: [
    {
      priceId: 'bades-price-pro-monthly',
      unitAmount: PRO_MONTHLY_IDR,
      currency: 'IDR',
      interval: SubscriptionInterval.Month,
      usageType: BillingUsageType.LICENSED,
    },
    {
      priceId: 'bades-price-pro-yearly',
      unitAmount: PRO_YEARLY_IDR,
      currency: 'IDR',
      interval: SubscriptionInterval.Year,
      usageType: BillingUsageType.LICENSED,
    },
  ],
};

/**
 * Produk kredit pemakaian (top-up kredit untuk operasi berbasis pemakaian).
 */
export const RESOURCE_CREDIT: BadesBillingProductCatalogEntry = {
  productCode: 'bades-product-resource-credit',
  productKey: BillingProductKey.RESOURCE_CREDIT,
  name: 'Kredit Pemakaian Bades',
  description:
    'Kredit pemakaian untuk fitur berbasis konsumsi pada workspace Bades.',
  prices: [
    {
      priceId: 'bades-price-resource-credit',
      unitAmount: 0,
      currency: 'IDR',
      interval: SubscriptionInterval.Month,
      usageType: BillingUsageType.METERED,
    },
  ],
};

export const BADES_BILLING_CATALOG: BadesBillingProductCatalogEntry[] = [
  BASE_PRODUCT,
  RESOURCE_CREDIT,
];

/**
 * Pemetaan paket -> harga produk dasar per interval.
 */
export const BADES_PLAN_PRICE_BY_INTERVAL: Record<
  BillingPlanKey,
  Record<SubscriptionInterval, string>
> = {
  [BillingPlanKey.PRO]: {
    [SubscriptionInterval.Month]: 'bades-price-pro-monthly',
    [SubscriptionInterval.Year]: 'bades-price-pro-yearly',
  },
  [BillingPlanKey.ENTERPRISE]: {
    [SubscriptionInterval.Month]: 'bades-price-pro-monthly',
    [SubscriptionInterval.Year]: 'bades-price-pro-yearly',
  },
};

/**
 * Mengambil entri harga katalog berdasarkan slug `priceId`.
 */
export const getBadesBillingPriceByPriceId = (
  priceId: string,
): BadesBillingPriceCatalogEntry | undefined => {
  for (const product of BADES_BILLING_CATALOG) {
    const price = product.prices.find((entry) => entry.priceId === priceId);

    if (price) {
      return price;
    }
  }

  return undefined;
};

/**
 * Mengambil slug harga produk dasar untuk paket & interval tertentu.
 */
export const getBadesBasePriceId = (
  planKey: BillingPlanKey,
  interval: SubscriptionInterval,
): string => BADES_PLAN_PRICE_BY_INTERVAL[planKey][interval];
