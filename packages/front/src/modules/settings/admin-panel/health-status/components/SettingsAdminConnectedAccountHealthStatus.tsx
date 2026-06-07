import { SettingsAdminHealthAccountSyncCountersTable } from '@/settings/admin-panel/health-status/components/SettingsAdminHealthAccountSyncCountersTable';
import { SettingsAdminIndicatorHealthContext } from '@/settings/admin-panel/health-status/contexts/SettingsAdminIndicatorHealthContext';
import { styled } from '@linaria/react';
import { useContext } from 'react';
import { themeCssVariables } from 'ui/theme-constants';
import { AdminPanelHealthServiceStatus } from '~/generated-admin/graphql';

const StyledErrorMessage = styled.div`
  color: ${themeCssVariables.color.red};
  margin-top: ${themeCssVariables.spacing[2]};
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[8]};
`;

export const SettingsAdminConnectedAccountHealthStatus = () => {
  const { indicatorHealth } = useContext(SettingsAdminIndicatorHealthContext);
  const details = indicatorHealth.details;
  if (!details) {
    return null;
  }

  const parsedDetails = JSON.parse(details);
  const serviceDetails = parsedDetails.details;

  const isMessageSyncDown =
    serviceDetails.messageSync?.status === AdminPanelHealthServiceStatus.OUTAGE;
  const isCalendarSyncDown =
    serviceDetails.calendarSync?.status ===
    AdminPanelHealthServiceStatus.OUTAGE;

  const getErrorMessage = () => {
    if (isMessageSyncDown && isCalendarSyncDown) {
      return `Sinkronisasi Pesan dan Sinkronisasi Kalender tidak tersedia karena layanan sedang mati`;
    }
    if (isMessageSyncDown) {
      return `Sinkronisasi Pesan tidak tersedia karena layanan sedang mati`;
    }
    if (isCalendarSyncDown) {
      return `Sinkronisasi Kalender tidak tersedia karena layanan sedang mati`;
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <StyledContainer>
      {errorMessage && <StyledErrorMessage>{errorMessage}</StyledErrorMessage>}

      {!isMessageSyncDown && serviceDetails.messageSync?.details && (
        <SettingsAdminHealthAccountSyncCountersTable
          details={serviceDetails.messageSync.details}
          title={`Sinkronisasi Pesan`}
          description={`Pantau eksekusi pekerjaan sinkronisasi email Anda`}
        />
      )}

      {!isCalendarSyncDown && serviceDetails.calendarSync?.details && (
        <SettingsAdminHealthAccountSyncCountersTable
          details={serviceDetails.calendarSync.details}
          title={`Sinkronisasi Kalender`}
          description={`Pantau eksekusi pekerjaan sinkronisasi acara kalender Anda`}
        />
      )}
    </StyledContainer>
  );
};
