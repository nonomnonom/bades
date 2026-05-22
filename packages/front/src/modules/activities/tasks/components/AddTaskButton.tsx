import { useOpenCreateActivityDrawer } from '@/activities/hooks/useOpenCreateActivityDrawer';
import { type ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { CoreObjectNameSingular } from 'shared/types';
import { useObjectPermissionsForObject } from '@/object-record/hooks/useObjectPermissionsForObject';
import { t } from '~/utils/i18n/badesI18n';
import { IconPlus } from 'ui/display';
import { Button } from 'ui/input';

export const AddTaskButton = ({
  activityTargetableObject,
}: {
  activityTargetableObject: ActivityTargetableObject;
}) => {
  const openCreateActivity = useOpenCreateActivityDrawer({
    activityObjectNameSingular: CoreObjectNameSingular.Task,
  });

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular: activityTargetableObject.targetObjectNameSingular,
  });

  const objectPermissions = useObjectPermissionsForObject(
    objectMetadataItem.id,
  );

  const hasObjectUpdatePermissions = objectPermissions.canUpdateObjectRecords;

  if (!hasObjectUpdatePermissions) {
    return null;
  }

  return (
    <Button
      Icon={IconPlus}
      size="small"
      variant="secondary"
      title={t`Tambah tugas`}
      onClick={() =>
        openCreateActivity({
          targetableObjects: [activityTargetableObject],
        })
      }
    />
  );
};
