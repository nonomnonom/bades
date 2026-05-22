import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { SettingsUsageAnalyticsSection } from '@/settings/usage/components/SettingsUsageAnalyticsSection';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { getSettingsPath } from 'shared/utils';
import { SettingsPath } from 'shared/types';

export const SettingsUsage = () => {
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={t`Pemakaian`}
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: <Trans>Tagihan</Trans>,
          href: getSettingsPath(SettingsPath.Billing),
        },
        { children: <Trans>Pemakaian</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <SettingsUsageAnalyticsSection />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
