import { SettingsAccountsListEmptyStateCard } from '@/settings/accounts/components/SettingsAccountsListEmptyStateCard';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';

export const SettingsNewAccountSection = () => {
  return (
    <Section>
      <H2Title
        title={`Akun baru`}
        description={`Hubungkan akun baru ke Ruang Kerja Anda`}
      />
      <SettingsAccountsListEmptyStateCard />
    </Section>
  );
};
