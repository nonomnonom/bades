import { SettingsAccountsListEmptyStateCard } from '@/settings/accounts/components/SettingsAccountsListEmptyStateCard';
import { t } from '@lingui/core/macro';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';

export const SettingsNewAccountSection = () => {
  return (
    <Section>
      <H2Title
        title={t`Akun baru`}
        description={t`Hubungkan akun baru ke Ruang Kerja Anda`}
      />
      <SettingsAccountsListEmptyStateCard />
    </Section>
  );
};
