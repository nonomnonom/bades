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
        <Status color="green" text={""Operational"} weight="medium" />
      )}
      {status === AdminPanelHealthServiceStatus.OUTAGE && (
        <Status color="red" text={""Outage"} weight="medium" />
      )}
    </>
  );
};
