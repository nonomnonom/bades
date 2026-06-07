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
        <Status color="green" text={`Beroperasi`} weight="medium" />
      )}
      {status === AdminPanelHealthServiceStatus.OUTAGE && (
        <Status color="red" text={`Gangguan`} weight="medium" />
      )}
    </>
  );
};
