import { COMPANY_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/company-data-seeds.constant';
import { PERSON_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/person-data-seeds.constant';

type EmploymentHistoryDataSeed = {
  id: string;
  personId: string;
  companyId: string;
};

export const EMPLOYMENT_HISTORY_DATA_SEED_COLUMNS: (keyof EmploymentHistoryDataSeed)[] =
  ['id', 'personId', 'companyId'];

export const EMPLOYMENT_HISTORY_DATA_SEED_IDS = {
  ID_1: '20202020-e001-4000-8000-000000000001',
  ID_2: '20202020-e001-4000-8000-000000000002',
  ID_3: '20202020-e001-4000-8000-000000000003',
  ID_4: '20202020-e001-4000-8000-000000000004',
  ID_5: '20202020-e001-4000-8000-000000000005',
};

// Riwayat keterlibatan warga dengan lembaga desa lain
export const EMPLOYMENT_HISTORY_DATA_SEEDS: EmploymentHistoryDataSeed[] = [
  // Ahmad Santoso (Person 1) sebelumnya terdaftar di lembaga 2
  {
    id: EMPLOYMENT_HISTORY_DATA_SEED_IDS.ID_1,
    personId: PERSON_DATA_SEED_IDS.ID_1,
    companyId: COMPANY_DATA_SEED_IDS.ID_2,
  },
  // Ahmad Santoso (Person 1) juga pernah terdaftar di lembaga 3
  {
    id: EMPLOYMENT_HISTORY_DATA_SEED_IDS.ID_2,
    personId: PERSON_DATA_SEED_IDS.ID_1,
    companyId: COMPANY_DATA_SEED_IDS.ID_3,
  },
  // Budi Pratama (Person 2) sebelumnya terdaftar di lembaga 4
  {
    id: EMPLOYMENT_HISTORY_DATA_SEED_IDS.ID_3,
    personId: PERSON_DATA_SEED_IDS.ID_2,
    companyId: COMPANY_DATA_SEED_IDS.ID_4,
  },
  // Siti Kusuma (Person 3) sebelumnya terdaftar di lembaga 1
  {
    id: EMPLOYMENT_HISTORY_DATA_SEED_IDS.ID_4,
    personId: PERSON_DATA_SEED_IDS.ID_3,
    companyId: COMPANY_DATA_SEED_IDS.ID_1,
  },
  // Rizki Wijaya (Person 4) sebelumnya terdaftar di lembaga 5
  {
    id: EMPLOYMENT_HISTORY_DATA_SEED_IDS.ID_5,
    personId: PERSON_DATA_SEED_IDS.ID_4,
    companyId: COMPANY_DATA_SEED_IDS.ID_5,
  },
];
