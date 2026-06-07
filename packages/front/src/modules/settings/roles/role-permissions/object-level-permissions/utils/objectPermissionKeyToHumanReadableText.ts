import { type SettingsRoleObjectPermissionKey } from '@/settings/roles/role-permissions/objects-permissions/constants/SettingsRoleObjectPermissionIconConfig';
export const objectPermissionKeyToHumanReadable = (
  objectPermissionKey: SettingsRoleObjectPermissionKey,
) => {
  const permissionAction: Record<SettingsRoleObjectPermissionKey, string> = {
    canReadObjectRecords: `lihat`,
    canUpdateObjectRecords: `ubah`,
    canSoftDeleteObjectRecords: `hapus`,
    canDestroyObjectRecords: `hapus permanen`,
  };

  return permissionAction[objectPermissionKey];
};
