import { SettingsTableCard } from '@/settings/components/SettingsTableCard';
import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { SettingsAdminVersionDisplay } from '@/settings/admin-panel/components/SettingsAdminVersionDisplay';
import { t } from '@lingui/core/macro';
import { IconCircleDot, IconStatusChange } from 'ui/display';
import { useQuery } from '@apollo/client/react';
import { GetVersionInfoDocument } from '~/generated-admin/graphql';

export const SettingsAdminVersionContainer = () => {
  const apolloAdminClient = useApolloAdminClient();
  const { data, loading } = useQuery(GetVersionInfoDocument, {
    client: apolloAdminClient,
  });
  const { currentVersion, latestVersion } = data?.versionInfo ?? {};

  const versionItems = [
    {
      Icon: IconCircleDot,
      label: t`Versi saat ini`,
      value: (
        <SettingsAdminVersionDisplay
          version={currentVersion}
          loading={loading}
          noVersionMessage={t`Tidak diketahui`}
        />
      ),
    },
    {
      Icon: IconStatusChange,
      label: t`Versi terbaru`,
      value: (
        <SettingsAdminVersionDisplay
          version={latestVersion}
          loading={loading}
          noVersionMessage={t`Tidak ada versi terbaru`}
        />
      ),
    },
  ];

  return (
    <SettingsTableCard rounded items={versionItems} gridAutoColumns="3fr 8fr" />
  );
};
