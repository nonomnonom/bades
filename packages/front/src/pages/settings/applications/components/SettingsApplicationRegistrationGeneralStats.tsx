import {
  H2Title,
  IconBrandDocker,
  IconChartBar,
  IconStatusChange,
} from 'ui/display';
import { SettingsTableCard } from '@/settings/components/SettingsTableCard';
import {
  type ApplicationRegistration,
  FindApplicationRegistrationStatsDocument,
} from '~/generated-metadata/graphql';
import { useQuery } from '@apollo/client/react';
import { Section } from 'ui/layout';

export const SettingsApplicationRegistrationGeneralStats = ({
  registration,
}: {
  registration: ApplicationRegistration;
}) => {
  const applicationRegistrationId = registration.id;

  const { data: statsData } = useQuery(
    FindApplicationRegistrationStatsDocument,
    {
      variables: { id: applicationRegistrationId },
      skip: !applicationRegistrationId,
    },
  );

  const stats = statsData?.findApplicationRegistrationStats;

  const hasStats = (stats?.activeInstalls ?? 0) > 0;

  if (!hasStats) {
    return null;
  }

  const versionDistributionLabel =
    stats?.versionDistribution
      ?.map(
        (entry: { version: string; count: number }) =>
          `${entry.version} (${entry.count})`,
      )
      .join(', ') || '—';

  const statsItems = [
    {
      Icon: IconBrandDocker,
      label: `Instalasi aktif`,
      value: stats?.activeInstalls ?? '—',
    },
    {
      Icon: IconStatusChange,
      label: `Versi paling banyak dipasang`,
      value: stats?.mostInstalledVersion ?? '—',
    },
    {
      Icon: IconChartBar,
      label: `Distribusi`,
      value: versionDistributionLabel,
    },
  ];

  return (
    <Section>
      <H2Title
        title={`Statistik Instalasi`}
        description={`Penggunaan di semua ruang kerja pada server ini`}
      />
      <SettingsTableCard
        rounded
        items={statsItems}
        gridAutoColumns="200px 1fr"
      />
    </Section>
  );
};
