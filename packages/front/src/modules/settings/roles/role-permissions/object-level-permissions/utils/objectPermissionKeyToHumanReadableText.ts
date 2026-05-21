import { type SettingsRoleObjectPermissionKey } from '@/settings/roles/role-permissions/objects-permissions/constants/SettingsRoleObjectPermissionIconConfig';
import { t } from '@lingui/core/macro';

export const objectPermissionKeyToHumanReadable = (
  objectPermissionKey: SettingsRoleObjectPermissionKey,
) => {
  const permissionAction: Record<SettingsRoleObjectPermissionKey, string> = {
    canReadObjectRecords: ""see",
    canUpdateObjectRecords: ""update",
    canSoftDeleteObjectRecords: ""delete",
    canDestroyObjectRecords: ""destroy",
  };

  return permissionAction[objectPermissionKey];
};
