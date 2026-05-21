import {
  SEED_SUKAMAJU_WORKSPACE_ID,
  SEED_MEKARSARI_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { generateRandomUsers } from 'src/engine/workspace-manager/dev-seeder/core/utils/generate-random-users.util';
import { USER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-users.util';

type WorkspaceMemberDataSeed = {
  id: string;
  nameFirstName: string;
  nameLastName: string;
  locale: string;
  colorScheme: string;
  userEmail: string;
  userId: string;
};

export const WORKSPACE_MEMBER_DATA_SEED_COLUMNS: (keyof WorkspaceMemberDataSeed)[] =
  [
    'id',
    'nameFirstName',
    'nameLastName',
    'locale',
    'colorScheme',
    'userEmail',
    'userId',
  ];

export const WORKSPACE_MEMBER_DATA_SEED_IDS = {
  KADES: '20202020-0687-4c41-b707-ed1bfca972a7',
  SEKDES: '20202020-77d5-4cb6-b60a-f4a835a85d61',
  KAUR: '20202020-1553-45c6-a028-5a9064cce07f',
  KASI: '20202020-463f-435b-828c-107e007a2711',
};

const {
  workspaceMembers: randomWorkspaceMembers,
  workspaceMemberIds: randomWorkspaceMemberIds,
} = generateRandomUsers();

export const RANDOM_WORKSPACE_MEMBER_IDS = randomWorkspaceMemberIds;

const originalWorkspaceMembers: WorkspaceMemberDataSeed[] = [
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
    nameFirstName: 'Drs.',
    nameLastName: 'H. Abdullah',
    locale: 'id',
    colorScheme: 'Light',
    userEmail: 'kepaladesa@sukamaju.desa.id',
    userId: USER_DATA_SEED_IDS.KADES,
  },
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    nameFirstName: 'Ahmad',
    nameLastName: 'Hidayat',
    locale: 'id',
    colorScheme: 'Light',
    userEmail: 'sekretaris@sukamaju.desa.id',
    userId: USER_DATA_SEED_IDS.SEKDES,
  },
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.KAUR,
    nameFirstName: 'Dewi',
    nameLastName: 'Lestari',
    locale: 'id',
    colorScheme: 'Light',
    userEmail: 'kaur@bades.id',
    userId: USER_DATA_SEED_IDS.KAUR,
  },
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.KASI,
    nameFirstName: 'Hendra',
    nameLastName: 'Wijaya',
    locale: 'id',
    colorScheme: 'Light',
    userEmail: 'kasi.pembangunan@bades.id',
    userId: USER_DATA_SEED_IDS.KASI,
  },
];

export const WORKSPACE_MEMBER_DATA_SEEDS: WorkspaceMemberDataSeed[] = [
  ...originalWorkspaceMembers,
  ...randomWorkspaceMembers,
];

export const getWorkspaceMemberDataSeeds = (
  workspaceId: string,
): WorkspaceMemberDataSeed[] => {
  // In test environment, only return original members to avoid conflicts
  if (process.env.NODE_ENV === 'test') {
    return originalWorkspaceMembers;
  }

  if (workspaceId === SEED_SUKAMAJU_WORKSPACE_ID) {
    // Sukamaju workspace gets all workspace members (original + random)
    return WORKSPACE_MEMBER_DATA_SEEDS;
  } else if (workspaceId === SEED_MEKARSARI_WORKSPACE_ID) {
    // Mekar Sari workspace gets all 4 original workspace members
    return originalWorkspaceMembers;
  }

  return originalWorkspaceMembers;
};