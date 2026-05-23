import { plural, t } from '~/utils/i18n/badesI18n';
import { SettingsAdminQueueJobsTable } from '@/settings/admin-panel/health-status/components/SettingsAdminQueueJobsTable';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';

export const SettingsAdminQueueDetail = () => {
  const { queueName } = useParams<{ queueName: string }>();
  const [retentionConfig, setRetentionConfig] = useState<{
    completedMaxAge: number;
    completedMaxCount: number;
    failedMaxAge: number;
    failedMaxCount: number;
  } | null>(null);

  if (!queueName) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (days >= 1) {
      return plural(days, {
        one: `${days} hari`,
        other: `${days} hari`,
      });
    }

    return plural(hours, {
      one: `${hours} jam`,
      other: `${hours} jam`,
    });
  };

  const completedDuration = retentionConfig
    ? formatDuration(retentionConfig.completedMaxAge)
    : '';
  const failedDuration = retentionConfig
    ? formatDuration(retentionConfig.failedMaxAge)
    : '';
  const maxCount = retentionConfig ? retentionConfig.completedMaxCount : 0;

  const queueDescription = retentionConfig
    ? t`Pekerjaan selesai disimpan selama ${completedDuration}, pekerjaan gagal disimpan selama ${failedDuration} (maks ${maxCount} masing-masing)`
    : t`Memuat konfigurasi retensi...`;

  return (
    <SubMenuTopBarContainer
      title={t`Antrian: ${queueName}`}
      links={[
        {
          children: t`Lainnya`,
          href: getSettingsPath(SettingsPath.AdminPanel),
        },
        {
          children: t`Panel Admin - Kesehatan`,
          href: getSettingsPath(SettingsPath.AdminPanelHealthStatus),
        },
        {
          children: 'Worker',
          href: getSettingsPath(SettingsPath.AdminPanelIndicatorHealthStatus, {
            indicatorId: 'worker',
          }),
        },
        {
          children: queueName,
        },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title title={t`Pekerjaan`} description={queueDescription} />
          <SettingsAdminQueueJobsTable
            queueName={queueName}
            onRetentionConfigLoaded={setRetentionConfig}
          />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
