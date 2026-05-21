import { type QueryRunner } from 'typeorm';

import { type UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import {
  SEED_SUKAMAJU_WORKSPACE_ID,
  SEED_MEKARSARI_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { generateRandomUsers } from 'src/engine/workspace-manager/dev-seeder/core/utils/generate-random-users.util';
import { USER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-users.util';

const tableName = 'userWorkspace';

export const USER_WORKSPACE_DATA_SEED_IDS = {
  KASI: '20202020-1e7c-43d9-a5db-685b5069d816',
  KADES: '20202020-9e3b-46d4-a556-88b9ddc2b035',
  SEKDES: '20202020-3957-4908-9c36-2929a23f8353',
  KAUR: '20202020-7169-42cf-bc47-1cfef15264b1',
  KASI_ACME: '20202020-ae8d-41ea-9469-f74f5d4b002e',
  KADES_ACME: '20202020-e10a-4c27-a90b-b08c57b02d44',
  SEKDES_ACME: '20202020-e10a-4c27-a90b-b08c57b02d45',
  KAUR_ACME: '20202020-e10a-4c27-a90b-b08c57b02d46',
};

const {
  userWorkspaces: randomUserWorkspaces,
  userWorkspaceIds: randomUserWorkspaceIds,
} = generateRandomUsers();

export const RANDOM_USER_WORKSPACE_IDS = randomUserWorkspaceIds;

type SeedUserWorkspacesArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const seedUserWorkspaces = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedUserWorkspacesArgs) => {
  let userWorkspaces: Pick<
    UserWorkspaceEntity,
    'id' | 'userId' | 'workspaceId'
  >[] = [];

  if (workspaceId === SEED_SUKAMAJU_WORKSPACE_ID) {
    const originalUserWorkspaces = [
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.KADES,
        userId: USER_DATA_SEED_IDS.KADES,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.KASI,
        userId: USER_DATA_SEED_IDS.KASI,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.SEKDES,
        userId: USER_DATA_SEED_IDS.SEKDES,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.KAUR,
        userId: USER_DATA_SEED_IDS.KAUR,
        workspaceId,
      },
    ];

    userWorkspaces = [...originalUserWorkspaces, ...randomUserWorkspaces];
  }

  if (workspaceId === SEED_MEKARSARI_WORKSPACE_ID) {
    userWorkspaces = [
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.KADES_ACME,
        userId: USER_DATA_SEED_IDS.KADES,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.SEKDES_ACME,
        userId: USER_DATA_SEED_IDS.SEKDES,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.KAUR_ACME,
        userId: USER_DATA_SEED_IDS.KAUR,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.KASI_ACME,
        userId: USER_DATA_SEED_IDS.KASI,
        workspaceId,
      },
    ];
  }
  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, ['id', 'userId', 'workspaceId'])
    .orIgnore()
    .values(userWorkspaces)
    .execute();
};

type DeleteUserWorkspacesArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const deleteUserWorkspaces = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: DeleteUserWorkspacesArgs) => {
  await queryRunner.manager
    .createQueryBuilder()
    .delete()
    .from(`${schemaName}.${tableName}`)
    .where(`"${tableName}"."workspaceId" = :workspaceId`, {
      workspaceId,
    })
    .execute();
};
