import { type ObjectsPermissions } from 'shared/types';
import { type PermissionFlagType } from 'shared/constants';

export type UserWorkspacePermissions = {
  permissionFlags: Record<PermissionFlagType, boolean>;
  objectsPermissions: ObjectsPermissions;
};
