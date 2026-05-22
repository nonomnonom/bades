import { type CurrentWorkspace } from '@/auth/states/currentWorkspaceState';
import { useNumberFormat } from '@/localization/hooks/useNumberFormat';
import { ResourceCreditPriceSelector } from '@/settings/billing/components/internal/ResourceCreditPriceSelector';
import { SettingsBillingLabelValueItem } from '@/settings/billing/components/internal/SettingsBillingLabelValueItem';
import { SettingsBillingTopUpSection } from '@/settings/billing/components/SettingsBillingTopUpSection';
import { SubscriptionInfoContainer } from '@/settings/billing/components/SubscriptionInfoContainer';
import { useBillingWording } from '@/settings/billing/hooks/useBillingWording';
import { useCurrentBillingFlags } from '@/settings/billing/hooks/useCurrentBillingFlags';
import { useCurrentResourceCredit } from '@/settings/billing/hooks/useCurrentResourceCredit';
import { useGetResourceCreditUsage } from '@/settings/billing/hooks/useGetResourceCreditUsage';
import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';
import { useSubscriptionStatus } from '@/workspace/hooks/useSubscriptionStatus';
import { styled } from '@linaria/react';
import { t } from '~/utils/i18n/badesI18n';
import { useContext } from 'react';
import { DOCUMENTATION_PATHS } from 'shared/constants';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import {
  H2Title,
  HorizontalSeparator,
  IconChartBar,
  IconExternalLink,
} from 'ui/display';
import { ProgressBar } from 'ui/feedback';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { UndecoratedLink } from 'ui/navigation';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';
import { SubscriptionStatus } from '~/generated-metadata/graphql';

const StyledCreditUsageFooterActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[4]};
`;

export const SettingsBillingCreditsSection = ({
  currentBillingSubscription,
}: {
  currentBillingSubscription: NonNullable<
    CurrentWorkspace['currentBillingSubscription']
  >;
}) => {
  const { theme } = useContext(ThemeContext);
  const subscriptionStatus = useSubscriptionStatus();
  const { formatNumber } = useNumberFormat();

  const { isMonthlyPlan } = useCurrentBillingFlags();

  const { getResourceCreditPricesByInterval } = useCurrentResourceCredit();

  const { getIntervalLabel } = useBillingWording();

  const isTrialing = subscriptionStatus === SubscriptionStatus.Trialing;

  const { getResourceCreditUsage } = useGetResourceCreditUsage();

  const { usedCredits, grantedCredits, totalGrantedCredits, rolloverCredits } =
    getResourceCreditUsage();

  const progressBarValue = (usedCredits / totalGrantedCredits) * 100;

  const intervalLabel = getIntervalLabel(isMonthlyPlan);

  const resourceCreditPrices = getResourceCreditPricesByInterval(
    currentBillingSubscription.interval,
  );

  return (
    <>
      <Section>
        <H2Title
          title={t`Pemakaian kredit`}
          description={t`Pantau pemakaian kredit alur kerja Anda per ${intervalLabel}.`}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={t`Kredit terpakai`}
            value={`${formatNumber(usedCredits, { abbreviate: true, decimals: 2 })}/${formatNumber(totalGrantedCredits, { abbreviate: true, decimals: 2 })}`}
          />
          <ProgressBar
            value={progressBarValue}
            barColor={
              progressBarValue > 100 ? theme.color.red8 : theme.color.blue
            }
            backgroundColor={theme.background.tertiary}
            withBorderRadius={true}
          />

          {!isTrialing && (
            <>
              <HorizontalSeparator noMargin color={theme.background.tertiary} />
              <SettingsBillingLabelValueItem
                label={t`Kredit dasar`}
                value={formatNumber(grantedCredits, {
                  abbreviate: true,
                  decimals: 2,
                })}
              />
              {rolloverCredits > 0 && (
                <SettingsBillingLabelValueItem
                  label={t`Sisa kredit periode lalu`}
                  value={formatNumber(rolloverCredits, {
                    abbreviate: true,
                    decimals: 2,
                  })}
                  tooltipText={t`Kredit yang belum terpakai dari periode sebelumnya. Hangus di akhir periode.`}
                  tooltipId="rollover-credits-info"
                />
              )}
              {rolloverCredits > 0 && (
                <SettingsBillingLabelValueItem
                  label={t`Total tersedia`}
                  value={formatNumber(totalGrantedCredits, {
                    abbreviate: true,
                    decimals: 2,
                  })}
                />
              )}
            </>
          )}
        </SubscriptionInfoContainer>

        <StyledCreditUsageFooterActions>
          <UndecoratedLink to={getSettingsPath(SettingsPath.Usage)}>
            <Button
              Icon={IconChartBar}
              title={t`Lihat pemakaian`}
              variant="secondary"
            />
          </UndecoratedLink>
          <Button
            Icon={IconExternalLink}
            title={t`Cara kerja kredit`}
            variant="secondary"
            onClick={() =>
              window.open(
                getDocumentationUrl({
                  path: DOCUMENTATION_PATHS.USER_GUIDE_BILLING_CAPABILITIES_CREDITS,
                }),
                '_blank',
              )
            }
          />
        </StyledCreditUsageFooterActions>
      </Section>
      <Section>
        <ResourceCreditPriceSelector
          resourceCreditPrices={resourceCreditPrices}
          isTrialing={isTrialing}
        />
      </Section>
      <SettingsBillingTopUpSection />
    </>
  );
};
