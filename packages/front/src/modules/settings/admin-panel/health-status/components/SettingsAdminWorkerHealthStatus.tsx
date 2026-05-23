import { SettingsAdminWorkerQueueMetricsSection } from '@/settings/admin-panel/health-status/components/SettingsAdminWorkerQueueMetricsSection';
import { styled } from '@linaria/react';
import { t } from '~/utils/i18n/badesI18n';
import { useContext } from 'react';
import { AdminPanelHealthServiceStatus } from '~/generated-admin/graphql';
import { SettingsAdminIndicatorHealthContext } from '@/settings/admin-panel/health-status/contexts/SettingsAdminIndicatorHealthContext';
import { themeCssVariables } from 'ui/theme-constants';

const StyledErrorMessage = styled.div`
  color: ${themeCssVariables.color.red};
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const SettingsAdminWorkerHealthStatus = () => {
  const { indicatorHealth } = useContext(SettingsAdminIndicatorHealthContext);

  const isWorkerDown =
    !indicatorHealth.status ||
    indicatorHealth.status === AdminPanelHealthServiceStatus.OUTAGE;

  return (
    <>
      {isWorkerDown ? (
        <StyledErrorMessage>
          {t`Informasi antrian tidak tersedia karena worker sedang mati`}
        </StyledErrorMessage>
      ) : (
        (indicatorHealth.queues ?? []).map((queue) => (
          <SettingsAdminWorkerQueueMetricsSection
            key={queue.queueName}
            queue={queue}
          />
        ))
      )}
    </>
  );
};
