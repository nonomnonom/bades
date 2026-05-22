import { useNumberFormat } from '@/localization/hooks/useNumberFormat';
import { useTopUpCredit } from '@/settings/billing/hooks/useTopUpCredit';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { styled } from '@linaria/react';
import { Trans, t } from '~/utils/i18n/badesI18n';
import { useState } from 'react';
import { H2Title, IconCoins } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

const TOP_UP_PRESET_AMOUNTS = [50_000, 100_000, 250_000, 500_000];

const MINIMUM_TOP_UP_AMOUNT = 10_000;

const StyledPresetGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
  margin-bottom: ${themeCssVariables.spacing[4]};
`;

const StyledCustomAmountRow = styled.div`
  align-items: flex-end;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

export const SettingsBillingTopUpSection = () => {
  const { formatNumber } = useNumberFormat();
  const { isSubmitting, handleTopUpCredit } = useTopUpCredit();

  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const parsedCustomAmount = Number(customAmount.replace(/\D/g, ''));

  const grossAmount =
    parsedCustomAmount > 0 ? parsedCustomAmount : (selectedPreset ?? 0);

  const isAmountValid = grossAmount >= MINIMUM_TOP_UP_AMOUNT;

  const handleSelectPreset = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount('');
  };

  const handleChangeCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedPreset(null);
  };

  const handlePay = () => {
    if (!isAmountValid) {
      return;
    }

    handleTopUpCredit({
      grossAmount,
      itemName: t`Isi Ulang Saldo Kredit Bades`,
    });
  };

  return (
    <Section>
      <H2Title
        title={t`Isi ulang saldo kredit`}
        description={t`Tambah saldo kredit untuk pemakaian alur kerja. Pembayaran diproses melalui Midtrans.`}
      />
      <StyledPresetGrid>
        {TOP_UP_PRESET_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            title={`Rp${formatNumber(amount)}`}
            variant={selectedPreset === amount ? 'primary' : 'secondary'}
            onClick={() => handleSelectPreset(amount)}
          />
        ))}
      </StyledPresetGrid>
      <StyledCustomAmountRow>
        <SettingsTextInput
          instanceId="billing-top-up-custom-amount"
          label={t`Nominal lain (Rupiah)`}
          value={customAmount}
          onChange={handleChangeCustomAmount}
          placeholder={t`Contoh: 150000`}
          fullWidth
        />
        <Button
          Icon={IconCoins}
          title={t`Bayar sekarang`}
          variant="primary"
          accent="blue"
          onClick={handlePay}
          disabled={!isAmountValid || isSubmitting}
        />
      </StyledCustomAmountRow>
      {!isAmountValid && grossAmount > 0 && (
        <Trans>
          Nominal isi ulang minimal Rp{formatNumber(MINIMUM_TOP_UP_AMOUNT)}.
        </Trans>
      )}
    </Section>
  );
};
