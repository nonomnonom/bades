import { useLingui } from '~/utils/i18n/badesI18n';
import { type ApplicationRegistration } from '~/generated-metadata/graphql';

import { useNavigate } from 'react-router-dom';
import { InlineBanner } from 'ui/display';
import { SettingsApplicationRegistrationGeneralInfo } from '~/pages/settings/applications/components/SettingsApplicationRegistrationGeneralInfo';

import { SettingsAdminApplicationRegistrationDangerZone } from '~/pages/settings/admin-panel/SettingsAdminApplicationRegistrationDangerZone';
import { SettingsApplicationRegistrationGeneralStats } from '~/pages/settings/applications/components/SettingsApplicationRegistrationGeneralStats';
import { SettingsAdminApplicationRegistrationGeneralToggles } from '~/pages/settings/admin-panel/SettingsAdminApplicationRegistrationGeneralToggles';

export const SettingsApplicationRegistrationGeneralTab = ({
  registration,
  fromAdmin,
}: {
  registration: ApplicationRegistration;
  fromAdmin?: boolean;
}) => {
  const { t } = useLingui();
  const navigate = useNavigate();

  return (
    <>
      {!registration.isConfigured && fromAdmin && (
        <InlineBanner
          color="danger"
          message={t`Aplikasi ini memiliki variabel server wajib yang belum dikonfigurasi. Pengguna tidak akan dapat memasangnya sampai semua variabel wajib diisi.`}
          button={{
            title: t`Konfigurasi`,
            onClick: () => navigate('#config'),
          }}
        />
      )}
      <SettingsApplicationRegistrationGeneralInfo registration={registration} />
      {fromAdmin && (
        <SettingsAdminApplicationRegistrationGeneralToggles
          registration={registration}
        />
      )}
      <SettingsApplicationRegistrationGeneralStats
        registration={registration}
      />
      <SettingsAdminApplicationRegistrationDangerZone
        registration={registration}
        fromAdmin={fromAdmin}
      />
    </>
  );
};
