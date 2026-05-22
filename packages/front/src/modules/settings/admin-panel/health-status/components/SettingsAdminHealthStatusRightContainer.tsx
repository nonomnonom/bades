import { t } from '@lingui/core/macro';
import { Status } from 'ui/display';
import { AdminPanelHealthServiceStatus } from '~/generated-admin/graphql';

export const SettingsAdminHealthStatusRightContainer = ({
  status,
}: {
  status: AdminPanelHealthServiceStatus;
}) => {
  return (
    <>
      {status === AdminPanelHealthServiceStatus.OPERATIONAL && (
        <Status color="green" text={t`Beroperasi`} weight="medium" />
      )}
      {status === AdminPanelHealthServiceStatus.OUTAGE && (
        <Status color="red" text={t`Gangguan`} weight="medium" />
      )}
    </>
  );
};
