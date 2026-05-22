import { useLingui } from '~/utils/i18n/badesI18n';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { IconApps, IconDownload } from 'ui/display';
import { FeatureFlagKey } from '~/generated-metadata/graphql';
import { SettingsApplicationsAvailableTab } from '~/pages/settings/applications/tabs/SettingsApplicationsAvailableTab';
import { SettingsApplicationsDeveloperTab } from '~/pages/settings/applications/tabs/SettingsApplicationsDeveloperTab';
import { SettingsApplicationsInstalledTab } from '~/pages/settings/applications/tabs/SettingsApplicationsInstalledTab';

const APPLICATIONS_TAB_LIST_ID = 'applications-tab-list';

export const SettingsApplications = () => {
  const { t } = useLingui();

  const isMarketplaceSettingTabVisible = useIsFeatureEnabled(
    FeatureFlagKey.IS_MARKETPLACE_SETTING_TAB_VISIBLE,
  );

  const activeTabId = useAtomComponentStateValue(
    activeTabIdComponentState,
    APPLICATIONS_TAB_LIST_ID,
  );

  const tabs = [
    ...(isMarketplaceSettingTabVisible
      ? [{ id: 'marketplace', title: t`Katalog Aplikasi`, Icon: IconDownload }]
      : []),
    { id: 'installed', title: t`Terpasang`, Icon: IconApps },
  ];

  const renderActiveTabContent = () => {
    switch (activeTabId) {
      case 'marketplace':
        return <SettingsApplicationsAvailableTab />;
      case 'installed':
        return <SettingsApplicationsInstalledTab />;
      case 'developer':
        return <SettingsApplicationsDeveloperTab />;
      default:
        return isMarketplaceSettingTabVisible ? (
          <SettingsApplicationsAvailableTab />
        ) : (
          <SettingsApplicationsInstalledTab />
        );
    }
  };

  return (
    <SubMenuTopBarContainer
      title={t`Aplikasi`}
      links={[
        {
          children: t`Ruang Kerja`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`Aplikasi` },
      ]}
    >
      <SettingsPageContainer>
        <TabList tabs={tabs} componentInstanceId={APPLICATIONS_TAB_LIST_ID} />
        {renderActiveTabContent()}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
