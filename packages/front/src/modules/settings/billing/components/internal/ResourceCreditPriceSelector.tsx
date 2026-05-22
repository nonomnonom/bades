import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useNumberFormat } from '@/localization/hooks/useNumberFormat';
import { useBillingWording } from '@/settings/billing/hooks/useBillingWording';
import { useCurrentResourceCredit } from '@/settings/billing/hooks/useCurrentResourceCredit';
import { useGetResourceCreditUsage } from '@/settings/billing/hooks/useGetResourceCreditUsage';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { Select } from '@/ui/input/components/Select';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useMutation } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { t } from '~/utils/i18n/badesI18n';
import { useState } from 'react';
import { isDefined } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Button } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';
import {
  SetResourceCreditSubscriptionPriceDocument,
  SubscriptionInterval,
  type BillingPriceLicensed,
} from '~/generated-metadata/graphql';

const StyledRow = styled.div`
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledSelectContainer = styled.div`
  flex: 1 1;
`;

const StyledButtonContainer = styled.div`
  flex: 0 0 auto;
`;

export const ResourceCreditPriceSelector = ({
  resourceCreditPrices,
  isTrialing = false,
}: {
  resourceCreditPrices: BillingPriceLicensed[];
  isTrialing?: boolean;
}) => {
  const { currentResourceCreditBillingPrice } = useCurrentResourceCredit();
  const { formatNumber } = useNumberFormat();

  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );

  const { refetchResourceCreditUsage } = useGetResourceCreditUsage();

  const { getIntervalLabel } = useBillingWording();

  const [currentResourceCreditPrice, setCurrentResourceCreditPrice] = useState(
    currentResourceCreditBillingPrice,
  );

  const toOption = (price: BillingPriceLicensed) => {
    const priceDisplay = formatNumber((price.unitAmount ?? 0) / 100);
    const credits = formatNumber(price.creditAmount ?? 0, {
      abbreviate: true,
      decimals: 2,
    });

    return {
      label: t`${credits} kredit - Rp${priceDisplay}`,
      value: price.priceId,
    };
  };

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const [setResourceCreditPrice, { loading: isUpdating }] = useMutation(
    SetResourceCreditSubscriptionPriceDocument,
  );

  const options = [...resourceCreditPrices]
    .sort((a, b) => (a.creditAmount ?? 0) - (b.creditAmount ?? 0))
    .map(toOption);

  const { openModal } = useModal();
  const [selectedPriceId, setSelectedPriceId] = useState<string | undefined>(
    undefined,
  );

  const selectedPrice = resourceCreditPrices.find(
    ({ priceId }) => priceId === selectedPriceId,
  );

  const isChanged =
    isDefined(selectedPriceId) &&
    selectedPriceId !== currentResourceCreditPrice?.priceId;

  const isUpgrade = () => {
    if (
      !isChanged ||
      !isDefined(selectedPrice) ||
      !isDefined(currentResourceCreditPrice)
    )
      return false;

    return (
      (selectedPrice.creditAmount ?? 0) >
      (currentResourceCreditPrice.creditAmount ?? 0)
    );
  };

  const handleChange = (priceId: string) => {
    setSelectedPriceId(priceId);
  };

  const confirmModalId = 'RESOURCE_CREDIT_PRICE_CHANGE_CONFIRMATION_MODAL';

  const handleOpenConfirm = () => {
    if (!isChanged || !selectedPrice) return;
    openModal(confirmModalId);
  };

  const recurringInterval = getIntervalLabel(
    currentResourceCreditPrice?.recurringInterval ===
      SubscriptionInterval.Month,
  );

  const handleConfirmClick = async () => {
    if (!selectedPrice) return;
    try {
      const { data } = await setResourceCreditPrice({
        variables: { priceId: selectedPrice.priceId },
      });
      if (
        isDefined(
          data?.setResourceCreditSubscriptionPrice.currentBillingSubscription,
        ) &&
        isDefined(currentWorkspace)
      ) {
        const newCurrentWorkspace = {
          ...currentWorkspace,
          currentBillingSubscription:
            data.setResourceCreditSubscriptionPrice.currentBillingSubscription,
          billingSubscriptions:
            data?.setResourceCreditSubscriptionPrice.billingSubscriptions,
        };
        setCurrentWorkspace(newCurrentWorkspace);
        refetchResourceCreditUsage();
      }
      enqueueSuccessSnackBar({
        message: t`Kredit sumber daya berhasil diperbarui.`,
      });
      const newPrice = resourceCreditPrices.find(
        ({ priceId }) => priceId === selectedPrice.priceId,
      );
      if (isDefined(newPrice)) {
        setCurrentResourceCreditPrice(newPrice);
      }
      setSelectedPriceId(undefined);
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal memperbarui kredit sumber daya.`,
      });
    }
  };

  return (
    <>
      <H2Title
        title={t`Kredit sumber daya`}
        description={t`Jumlah kredit baru yang dialokasikan setiap ${recurringInterval}`}
      />
      <StyledRow>
        <StyledSelectContainer>
          <Select
            dropdownId="settings_billing-resource-credit-price"
            options={options}
            value={
              selectedPriceId ?? currentResourceCreditPrice?.priceId ?? ''
            }
            onChange={handleChange}
            disabled={isUpdating || isTrialing}
            description={
              isTrialing ? t`Mulai langganan Anda terlebih dahulu` : undefined
            }
            fullWidth
          />
        </StyledSelectContainer>
        {isChanged && (
          <StyledButtonContainer>
            <Button
              title={isUpgrade() ? t`Tingkatkan` : t`Turunkan`}
              onClick={handleOpenConfirm}
              variant="primary"
              isLoading={isUpdating}
              disabled={!isChanged}
              accent={isUpgrade() ? 'blue' : 'danger'}
            />
          </StyledButtonContainer>
        )}
      </StyledRow>
      <ConfirmationModal
        modalInstanceId={confirmModalId}
        title={
          isUpgrade() ? t`Konfirmasi peningkatan` : t`Konfirmasi penurunan`
        }
        subtitle={t`Konfirmasi perubahan alokasi kredit sumber daya Anda saat ini.`}
        confirmButtonText={isUpgrade() ? t`Tingkatkan` : t`Turunkan`}
        confirmButtonAccent={isUpgrade() ? 'blue' : 'danger'}
        loading={isUpdating}
        onConfirmClick={handleConfirmClick}
      />
    </>
  );
};
