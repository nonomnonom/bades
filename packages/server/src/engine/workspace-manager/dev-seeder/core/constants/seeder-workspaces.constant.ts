import { WorkspaceActivationStatus } from 'shared/workspace';

import { type WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

export const WORKSPACE_FIELDS_TO_SEED = [
  'id',
  'displayName',
  'subdomain',
  'inviteHash',
  'logo',
  'activationStatus',
  'isTwoFactorAuthenticationEnforced',
  'workspaceCustomApplicationId',
] as const satisfies (keyof WorkspaceEntity)[];

export type CreateWorkspaceInput = Pick<
  WorkspaceEntity,
  (typeof WORKSPACE_FIELDS_TO_SEED)[number]
>;

export const SEED_SUKAMAJU_WORKSPACE_ID = '20202020-1c25-4d02-bf25-6aeccf7ea419';
export const SEED_MEKARSARI_WORKSPACE_ID =
  '3b8e6458-5fc1-4e63-8563-008ccddaa6db';
export const SEED_EMPTY_WORKSPACE_3_ID = '506915ec-21ca-431b-a04a-257eb216865e';
export const SEED_EMPTY_WORKSPACE_4_ID = 'aa8fdcb1-8ee1-4012-98af-44a97caa7411';

export type SeededWorkspacesIds =
  | typeof SEED_SUKAMAJU_WORKSPACE_ID
  | typeof SEED_MEKARSARI_WORKSPACE_ID;

export type SeededEmptyWorkspacesIds =
  | typeof SEED_EMPTY_WORKSPACE_3_ID
  | typeof SEED_EMPTY_WORKSPACE_4_ID;

export const SEEDER_CREATE_WORKSPACE_INPUT = {
  [SEED_SUKAMAJU_WORKSPACE_ID]: {
    id: SEED_SUKAMAJU_WORKSPACE_ID,
    displayName: 'Desa Sukamaju',
    subdomain: 'sukamaju',
    inviteHash: 'sukamaju.dev-invite-hash',
    logo: 'https://bades.id/placeholder-images/workspaces/sukamaju-logo.png',
    activationStatus: WorkspaceActivationStatus.PENDING_CREATION, // will be set to active after default role creation
    isTwoFactorAuthenticationEnforced: false,
  },
  [SEED_MEKARSARI_WORKSPACE_ID]: {
    id: SEED_MEKARSARI_WORKSPACE_ID,
    displayName: 'Desa Mekar Sari',
    subdomain: 'mekar-sari',
    inviteHash: 'mekar-sari.dev-invite-hash',
    logo: 'https://bades.id/placeholder-images/workspaces/mekar-sari-logo.png',
    activationStatus: WorkspaceActivationStatus.PENDING_CREATION, // will be set to active after default role creation
    isTwoFactorAuthenticationEnforced: false,
  },
} as const satisfies Record<
  SeededWorkspacesIds,
  Omit<CreateWorkspaceInput, 'workspaceCustomApplicationId'>
>;

// Empty workspaces with no users, metadata, or data — used by integration tests
// that need more than 2 workspaces (e.g. upgrade sequence runner tests).
export const SEEDER_CREATE_EMPTY_WORKSPACE_INPUT = {
  [SEED_EMPTY_WORKSPACE_3_ID]: {
    id: SEED_EMPTY_WORKSPACE_3_ID,
    displayName: 'Desa empty3',
    subdomain: 'empty3',
    inviteHash: 'empty3.dev-invite-hash',
    logo: '',
    activationStatus: WorkspaceActivationStatus.PENDING_CREATION,
    isTwoFactorAuthenticationEnforced: false,
  },
  [SEED_EMPTY_WORKSPACE_4_ID]: {
    id: SEED_EMPTY_WORKSPACE_4_ID,
    displayName: 'Desa empty4',
    subdomain: 'empty4',
    inviteHash: 'empty4.dev-invite-hash',
    logo: '',
    activationStatus: WorkspaceActivationStatus.PENDING_CREATION,
    isTwoFactorAuthenticationEnforced: false,
  },
} as const satisfies Record<
  SeededEmptyWorkspacesIds,
  Omit<CreateWorkspaceInput, 'workspaceCustomApplicationId'>
>;
