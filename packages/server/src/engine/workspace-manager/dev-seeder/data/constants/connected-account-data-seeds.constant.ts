import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type ConnectedAccountDataSeed = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  lastSyncHistoryId: string;
  accountOwnerId: string;
  refreshToken: string;
  accessToken: string;
  provider: string;
  handle: string;
};

export const CONNECTED_ACCOUNT_DATA_SEED_COLUMNS: (keyof ConnectedAccountDataSeed)[] =
  [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'lastSyncHistoryId',
    'accountOwnerId',
    'refreshToken',
    'accessToken',
    'provider',
    'handle',
  ];

export const CONNECTED_ACCOUNT_DATA_SEED_IDS = {
  KADES: '20202020-9ac0-4390-9a1a-ab4d2c4e1bb7',
  SEKDES: '20202020-0cc8-4d60-a3a4-803245698908',
  KAUR: '20202020-cafc-4323-908d-e5b42ad69fdf',
  KASI: '20202020-b5c7-46f0-bf5c-3f4e4b3f7c1a',
  KASI_DELETABLE: '20202020-d1e5-4a8f-9c3b-7f6d5e4c3b2a',
};

export const CONNECTED_ACCOUNT_DATA_SEEDS: ConnectedAccountDataSeed[] = [
  {
    id: CONNECTED_ACCOUNT_DATA_SEED_IDS.KADES,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    lastSyncHistoryId: 'exampleLastSyncHistory',
    accountOwnerId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
    refreshToken: 'exampleRefreshToken',
    accessToken: 'exampleAccessToken',
    provider: 'google',
    handle: 'kades@sukamaju.desa.id',
  },
  {
    id: CONNECTED_ACCOUNT_DATA_SEED_IDS.SEKDES,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    lastSyncHistoryId: 'exampleLastSyncHistory',
    accountOwnerId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    refreshToken: 'exampleRefreshToken',
    accessToken: 'exampleAccessToken',
    provider: 'google',
    handle: 'sekdes@sukamaju.desa.id',
  },
  {
    id: CONNECTED_ACCOUNT_DATA_SEED_IDS.KAUR,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    lastSyncHistoryId: 'exampleLastSyncHistory',
    accountOwnerId: WORKSPACE_MEMBER_DATA_SEED_IDS.KAUR,
    refreshToken: 'exampleRefreshToken',
    accessToken: 'exampleAccessToken',
    provider: 'google',
    handle: 'kaur@sukamaju.desa.id',
  },
  {
    id: CONNECTED_ACCOUNT_DATA_SEED_IDS.KASI,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    lastSyncHistoryId: 'exampleLastSyncHistory',
    accountOwnerId: WORKSPACE_MEMBER_DATA_SEED_IDS.KASI,
    refreshToken: 'exampleRefreshToken',
    accessToken: 'exampleAccessToken',
    provider: 'google',
    handle: 'kasi@sukamaju.desa.id',
  },
  {
    id: CONNECTED_ACCOUNT_DATA_SEED_IDS.KASI_DELETABLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    lastSyncHistoryId: 'exampleLastSyncHistory',
    accountOwnerId: WORKSPACE_MEMBER_DATA_SEED_IDS.KASI,
    refreshToken: 'exampleRefreshToken',
    accessToken: 'exampleAccessToken',
    provider: 'google',
    handle: 'kasi-deletable@sukamaju.desa.id',
  },
];
