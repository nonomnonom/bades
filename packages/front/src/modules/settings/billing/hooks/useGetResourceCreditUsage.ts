import { t } from '~/utils/i18n/badesI18n';

import { useQuery } from '@apollo/client/react';
import { isDefined } from 'shared/utils';
import {
  BillingProductKey,
  GetResourceCreditUsageDocument,
} from '~/generated-metadata/graphql';

export const useGetResourceCreditUsage = () => {
  const { data, loading, refetch } = useQuery(GetResourceCreditUsageDocument);

  const refetchResourceCreditUsage = () => {
    refetch();
  };

  const isGetResourceCreditUsageQueryLoaded = () => {
    return isDefined(data?.getResourceCreditUsage) && !loading;
  };

  const getResourceCreditUsage = () => {
    if (!data) {
      throw new Error(t`Penggunaan kredit resource belum dimuat`);
    }

    const usage = data.getResourceCreditUsage.find(
      (productUsage) =>
        productUsage.productKey === BillingProductKey.RESOURCE_CREDIT,
    );

    if (!isDefined(usage)) {
      throw new Error(t`Penggunaan RESOURCE_CREDIT tidak ditemukan`);
    }

    return usage;
  };

  return {
    refetchResourceCreditUsage,
    isGetResourceCreditUsageQueryLoaded: isGetResourceCreditUsageQueryLoaded(),
    getResourceCreditUsage,
  };
};
