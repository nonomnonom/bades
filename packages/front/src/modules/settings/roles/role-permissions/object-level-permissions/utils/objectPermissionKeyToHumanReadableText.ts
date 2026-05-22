import { type SettingsRoleObjectPermissionKey } from '@/settings/roles/role-permissions/objects-permissions/constants/SettingsRoleObjectPermissionIconConfig';
import { t } from '@lingui/core/macro';

export const objectPermissionKeyToHumanReadable = (
  objectPermissionKey: SettingsRoleObjectPermissionKey,
) => {
  const permissionAction: Record<SettingsRoleObjectPermissionKey, string> = {
    canReadObjectRecords: t`lihat`,
    canUpdateObjectRecords: t`ubah`,
    canSoftDeleteObjectRecords: t`hapus`,
    canDestroyObjectRecords: t`hapus permanen`,
  };

  return permissionAction[objectPermissionKey];
};
