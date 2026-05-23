import { useLingui } from '~/utils/i18n/badesI18n';
import { SettingsPath } from 'shared/types';
import { SettingsSectionSkeletonLoader } from '@/settings/components/SettingsSectionSkeletonLoader';
import { SettingsAccountsBlocklistSection } from '@/settings/accounts/components/SettingsAccountsBlocklistSection';
import { SettingsAccountsConnectedAccountsListCard } from '@/settings/accounts/components/SettingsAccountsConnectedAccountsListCard';
import { SettingsAccountsSettingsSection } from '@/settings/accounts/components/SettingsAccountsSettingsSection';
import { useMyConnectedAccounts } from '@/settings/accounts/hooks/useMyConnectedAccounts';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';

export const SettingsAccounts = () => {
  const { t } = useLingui();

  const { accounts: allAccounts, loading } = useMyConnectedAccounts();

  return (
    <SubMenuTopBarContainer
      title={t`Akun`}
      links={[
        {
          children: t`Pengguna`,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        { children: t`Akun` },
      ]}
    >
      <SettingsPageContainer>
        {loading ? (
          <SettingsSectionSkeletonLoader />
        ) : (
          <>
            <Section>
              <H2Title
                title={t`Akun terhubung`}
                description={t`Kelola akun internet Anda.`}
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
