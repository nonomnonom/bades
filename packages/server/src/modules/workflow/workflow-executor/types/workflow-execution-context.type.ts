import { type ActorMetadata } from 'shared/types';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { type RolePermissionConfig } from 'src/engine/sid-orm/types/role-permission-config';

export type WorkflowExecutionContext = {
  isActingOnBehalfOfUser: boolean;
  initiator: ActorMetadata;
  rolePermissionConfig: RolePermissionConfig;
  authContext: WorkspaceAuthContext;
};
