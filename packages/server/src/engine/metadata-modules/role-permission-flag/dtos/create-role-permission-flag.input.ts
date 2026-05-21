import { type PermissionFlagType } from 'shared/constants';

export type CreateRolePermissionFlagInput = {
  roleId: string;
  permissionFlagId: string;
  flag: PermissionFlagType;
  universalIdentifier?: string;
};
