import { SettingsPath } from 'shared/types';
import { SettingsSectionSkeletonLoader } from '@/settings/components/SettingsSectionSkeletonLoader';
import { SettingsAccountsBlocklistSection } from '@/settings/accounts/components/SettingsAccountsBlocklistSection';
import { SettingsAccountsConnectedAccountsListCard } from '@/settings/accounts/components/SettingsAccountsConnectedAccountsListCard';
import { SettingsAccountsSettingsSection } from '@/settings/accounts/components/SettingsAccountsSettingsSection';
import { useMyConnectedAccounts } from '@/settings/accounts/hooks/useMyConnectedAccounts';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useLingui } from '@lingui/react/macro';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';

export const SettingsAccounts = () => {
  const { t } = useLingui();

  const { accounts: allAccounts, loading } = useMyConnectedAccounts();

  return (
    <SubMenuTopBarContainer
      title={t`Account`}
      links={[
        {
          children: t`User`,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        { children: t`Account` },
      ]}
    >
      <SettingsPageContainer>
        {loading ? (
          <SettingsSectionSkeletonLoader />
        ) : (
          <>
            <Section>
              <H2Title
                title={t`Connected accounts`}
                description={t`Manage your internet accounts.`}
              />
              <SettingsAccountsConnectedAccountsListCard
                accounts={allAccounts}
              />
            </Section>
            <SettingsAccountsBlocklistSection />
            <SettingsAccountsSettingsSection />
          </>
        )}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
