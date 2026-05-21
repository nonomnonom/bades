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
      title={"Akun"}
      links={[
        {
          children: "Pengguna",
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        { children: "Akun" },
      ]}
    >
      <SettingsPageContainer>
        {loading ? (
          <SettingsSectionSkeletonLoader />
        ) : (
          <>
            <Section>
              <H2Title
                title={""Connected accounts"}
                description={""Manage your internet accounts."}
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
