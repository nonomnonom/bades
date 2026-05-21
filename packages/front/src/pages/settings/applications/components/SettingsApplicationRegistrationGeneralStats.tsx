import {
  H2Title,
  IconBrandDocker,
  IconChartBar,
  IconStatusChange,
} from 'ui/display';
import { useLingui } from '@lingui/react/macro';
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
  const { t } = useLingui();

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
      label: "Instalasi aktif",
      value: stats?.activeInstalls ?? '—',
    },
    {
      Icon: IconStatusChange,
      label: ""Most installed version",
      value: stats?.mostInstalledVersion ?? '—',
    },
    {
      Icon: IconChartBar,
      label: ""Distribution",
      value: versionDistributionLabel,
    },
  ];

  return (
    <Section>
      <H2Title
        title={""Install Stats"}
        description={""Usage across all workspaces on this server"}
      />
      <SettingsTableCard
        rounded
        items={statsItems}
        gridAutoColumns="200px 1fr"
      />
    </Section>
  );
};
