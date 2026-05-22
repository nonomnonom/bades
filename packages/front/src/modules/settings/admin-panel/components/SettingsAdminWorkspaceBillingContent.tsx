import { useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'shared/utils';
import { Tag } from 'ui/components';
import {
  H2Title,
  IconBox,
  IconCalendarEvent,
  IconCalendarRepeat,
  IconCircleX,
  IconCoins,
  IconCreditCard,
  IconExternalLink,
  IconId,
  IconStatusChange,
  IconTag,
  IconUsers,
} from 'ui/display';
import { Section } from 'ui/layout';
import { type ThemeColor } from 'ui/theme';
import { themeCssVariables } from 'ui/theme-constants';

import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { GET_WORKSPACE_BILLING_ADMIN_PANEL } from '@/settings/admin-panel/graphql/queries/getWorkspaceBillingAdminPanel';
import { SettingsTableCard } from '@/settings/components/SettingsTableCard';
import { PlansTags } from '@/settings/billing/components/internal/PlansTags';
import { SettingsSectionSkeletonLoader } from '@/settings/components/SettingsSectionSkeletonLoader';
import { useNumberFormat } from '@/localization/hooks/useNumberFormat';
import { beautifyExactDate } from '~/utils/date-utils';
import { BillingPlanKey } from '~/generated-metadata/graphql';
import {
  SubscriptionInterval,
  SubscriptionStatus,
  type WorkspaceBillingAdminPanelQuery,
} from '~/generated-admin/graphql';

const STRIPE_DASHBOARD_BASE_URL = 'https://dashboard.stripe.com';
const BASE_PRODUCT_KEY = 'BASE_PRODUCT';
const RESOURCE_CREDIT_KEY = 'RESOURCE_CREDIT';
const EM_DASH = '\u2014';

type SettingsAdminWorkspaceBillingContentProps = {
  workspaceId: string;
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  margin-top: ${themeCssVariables.spacing[6]};
`;

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: inline-flex;
  gap: ${themeCssVariables.spacing[1]};
  text-decoration: none;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledMono = styled.span`
  font-family: ${themeCssVariables.code.font.family};
`;

const StyledItemValue = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const STATUS_COLORS: Record<SubscriptionStatus, ThemeColor> = {
  [SubscriptionStatus.Active]: 'green',
  [SubscriptionStatus.Trialing]: 'blue',
  [SubscriptionStatus.PastDue]: 'orange',
  [SubscriptionStatus.Canceled]: 'red',
  [SubscriptionStatus.Unpaid]: 'red',
  [SubscriptionStatus.Paused]: 'gray',
  [SubscriptionStatus.Incomplete]: 'gray',
  [SubscriptionStatus.IncompleteExpired]: 'gray',
};

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.Active]: 'Aktif',
  [SubscriptionStatus.Trialing]: 'Masa Percobaan',
  [SubscriptionStatus.PastDue]: 'Jatuh Tempo',
  [SubscriptionStatus.Canceled]: 'Dibatalkan',
  [SubscriptionStatus.Unpaid]: 'Belum Dibayar',
  [SubscriptionStatus.Paused]: 'Dijeda',
  [SubscriptionStatus.Incomplete]: 'Tidak Lengkap',
  [SubscriptionStatus.IncompleteExpired]: 'Tidak Lengkap & Kedaluwarsa',
};

const formatCurrency = (amountMinor: number, currency: string): string => {
  const normalizedCurrency = currency.toUpperCase();

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: normalizedCurrency,
    }).format(amountMinor / 100);
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${normalizedCurrency}`;
  }
};

const toBillingPlanKey = (planKey: string): BillingPlanKey | null =>
  planKey === BillingPlanKey.PRO
    ? BillingPlanKey.PRO
    : planKey === BillingPlanKey.ENTERPRISE
      ? BillingPlanKey.ENTERPRISE
      : null;

const StripeLink = ({
  path,
  id,
}: {
  path: 'customers' | 'subscriptions';
  id: string;
}) => (
  <StyledExternalLink
    href={`${STRIPE_DASHBOARD_BASE_URL}/${path}/${id}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <StyledMono>{id}</StyledMono>
    <IconExternalLink size={12} />
  </StyledExternalLink>
);

export const SettingsAdminWorkspaceBillingContent = ({
  workspaceId,
}: SettingsAdminWorkspaceBillingContentProps) => {
  const { t } = useLingui();
  const { formatNumber } = useNumberFormat();
  const apolloAdminClient = useApolloAdminClient();

  const { data, loading } = useQuery<WorkspaceBillingAdminPanelQuery>(
    GET_WORKSPACE_BILLING_ADMIN_PANEL,
    {
      client: apolloAdminClient,
      variables: { workspaceId },
      skip: !workspaceId,
    },
  );

  if (loading) {
    return (
      <StyledContainer>
        <SettingsSectionSkeletonLoader rowCount={6} />
      </StyledContainer>
    );
  }

  const billing = data?.workspaceBillingAdminPanel ?? null;

  if (!billing) {
    return (
      <StyledContainer>
        <Section>
          <H2Title
            title={t`Billing`}
            description={t`Tidak ada data billing untuk workspace ini.`}
          />
        </Section>
      </StyledContainer>
    );
  }

  const { stripeCustomerId, creditBalance, subscription } = billing;

  const customerItems = [
    {
      Icon: IconId,
      label: t`Akun billing`,
      value: isDefined(stripeCustomerId) ? (
        <StripeLink path="customers" id={stripeCustomerId} />
      ) : (
        EM_DASH
      ),
    },
    {
      Icon: IconCoins,
      label: t`Saldo kredit`,
      value: isDefined(creditBalance)
        ? `${formatNumber(creditBalance, { abbreviate: true, decimals: 2 })} ${t`kredit`}`
        : EM_DASH,
    },
  ];

  const intervalLabel =
    subscription?.interval === SubscriptionInterval.Month
      ? t`Bulanan`
      : subscription?.interval === SubscriptionInterval.Year
        ? t`Tahunan`
        : null;

  const formatPeriod = (start: string, end: string): string =>
    `${beautifyExactDate(start)} → ${beautifyExactDate(end)}`;

  const planKey = isDefined(subscription?.planKey)
    ? toBillingPlanKey(subscription.planKey)
    : null;
  const isTrialing = subscription?.status === SubscriptionStatus.Trialing;

  const formatItemValue = (
    item: NonNullable<typeof subscription>['items'][number],
  ): string => {
    const parts: string[] = [];

    if (isDefined(item.quantity)) {
      parts.push(`${formatNumber(item.quantity)} ${t`pengguna`}`);
    }
    if (isDefined(item.includedCredits)) {
      parts.push(
        `${formatNumber(item.includedCredits, { abbreviate: true, decimals: 2 })} ${t`kredit/periode`}`,
      );
    }
    if (isDefined(item.unitAmount) && isDefined(subscription)) {
      parts.push(formatCurrency(item.unitAmount, subscription.currency));
    }

    return parts.length > 0 ? parts.join(' · ') : EM_DASH;
  };

  const subscriptionItems = subscription
    ? [
        {
          Icon: IconCreditCard,
          label: t`Langganan billing`,
          value: (
            <StripeLink
              path="subscriptions"
              id={subscription.stripeSubscriptionId}
            />
          ),
        },
        {
          Icon: IconStatusChange,
          label: t`Status`,
          value: (
            <Tag
              color={STATUS_COLORS[subscription.status]}
              text={STATUS_LABELS[subscription.status]}
            />
          ),
        },
        ...(isDefined(planKey)
          ? [
              {
                Icon: IconTag,
                label: t`Paket`,
                value: <PlansTags plan={planKey} isTrialPeriod={isTrialing} />,
              },
            ]
          : []),
        ...(isDefined(intervalLabel)
          ? [
              {
                Icon: IconCalendarEvent,
                label: t`Interval tagihan`,
                value: intervalLabel,
              },
            ]
          : []),
        {
          Icon: IconCalendarRepeat,
          label: t`Periode berjalan`,
          value: formatPeriod(
            subscription.currentPeriodStart,
            subscription.currentPeriodEnd,
          ),
        },
        ...(isDefined(subscription.trialStart) &&
        isDefined(subscription.trialEnd)
          ? [
              {
                Icon: IconCalendarRepeat,
                label: t`Periode percobaan`,
                value: formatPeriod(
                  subscription.trialStart,
                  subscription.trialEnd,
                ),
              },
            ]
          : []),
        ...(subscription.cancelAtPeriodEnd
          ? [
              {
                Icon: IconCircleX,
                label: t`Dibatalkan di akhir periode`,
                value: t`Ya`,
              },
            ]
          : []),
        ...(isDefined(subscription.cancelAt)
          ? [
              {
                Icon: IconCircleX,
                label: t`Dibatalkan pada`,
                value: beautifyExactDate(subscription.cancelAt),
              },
            ]
          : []),
        ...(isDefined(subscription.canceledAt)
          ? [
              {
                Icon: IconCircleX,
                label: t`Dibatalkan tanggal`,
                value: beautifyExactDate(subscription.canceledAt),
              },
            ]
          : []),
        ...subscription.items.map((item) => ({
          Icon:
            item.productKey === BASE_PRODUCT_KEY
              ? IconUsers
              : item.productKey === RESOURCE_CREDIT_KEY
                ? IconCoins
                : IconBox,
          label: item.productName || t`Produk tanpa nama`,
          value: (
            <StyledItemValue>
              <span>{formatItemValue(item)}</span>
              {isDefined(item.productKey) && (
                <Tag color="gray" text={item.productKey} />
              )}
            </StyledItemValue>
          ),
        })),
      ]
    : [];

  return (
    <StyledContainer>
      <Section>
        <H2Title
          title={t`Pelanggan billing`}
          description={t`Akun billing yang terhubung ke workspace ini`}
        />
        <SettingsTableCard
          rounded
          items={customerItems}
          gridAutoColumns="3fr 8fr"
        />
      </Section>

      <Section>
        <H2Title
          title={t`Langganan`}
          description={
            subscription
              ? t`Status langganan aktif dan rincian item`
              : t`Tidak ada langganan aktif.`
          }
        />
        {subscription && (
          <SettingsTableCard
            rounded
            items={subscriptionItems}
            gridAutoColumns="3fr 8fr"
          />
        )}
      </Section>
    </StyledContainer>
  );
};
