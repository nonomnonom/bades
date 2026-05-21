import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsUsageAnalyticsSection } from '@/settings/usage/components/SettingsUsageAnalyticsSection';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { getSettingsPath } from 'shared/utils';
import { SettingsPath } from 'shared/types';

export const SettingsUsage = () => {
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={"Penggunaan"}
      links={[
        {
          children: Ruang kerja,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: Penagihan,
          href: getSettingsPath(SettingsPath.Billing),
        },
        { children: Penggunaan },
      ]}
    >
      <SettingsPageContainer>
        <SettingsUsageAnalyticsSection />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
