import { type QueryRunner } from 'typeorm';

import { generateRandomUsers } from './generate-random-users.util';

const tableName = 'user';

export const USER_DATA_SEED_IDS = {
  KASI: '20202020-e6b5-4680-8a32-b8209737156b',
  KADES: '20202020-9e3b-46d4-a556-88b9ddc2b034',
  SEKDES: '20202020-3957-4908-9c36-2929a23f8357',
  KAUR: '20202020-7169-42cf-bc47-1cfef15264b8',
};

const { users: randomUsers, userIds: randomUserIds } = generateRandomUsers();

export const RANDOM_USER_IDS = randomUserIds;

type SeedUsersArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
};

export const seedUsers = async ({ queryRunner, schemaName }: SeedUsersArgs) => {
  const originalUsers = [
    {
      id: USER_DATA_SEED_IDS.KADES,
      firstName: 'Drs.',
      lastName: 'H. Abdullah',
      email: 'kades@sukamaju.desa.id',
      passwordHash:
        '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6',
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.SEKDES,
      firstName: 'Ahmad',
      lastName: 'Hidayat',
      email: 'sekdes@sukamaju.desa.id',
      passwordHash:
        '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6',
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.KAUR,
      firstName: 'Dewi',
      lastName: 'Lestari',
      email: 'kaur@sukamaju.desa.id',
      passwordHash:
        '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6',
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.KASI,
      firstName: 'Hendra',
      lastName: 'Wijaya',
      email: 'kasi@sukamaju.desa.id',
      passwordHash:
        '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6',
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
  ];

  const allUsers = [...originalUsers, ...randomUsers];

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, [
      'id',
      'firstName',
      'lastName',
      'email',
      'passwordHash',
      'canImpersonate',
      'canAccessFullAdminPanel',
      'isEmailVerified',
    ])
    .orIgnore()
    .values(allUsers)
    .execute();
};
