import { isDefined } from 'shared/utils';

import { COMPANY_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/company-data-seeds.constant';
import { PERSON_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/person-data-seeds.constant';
import {
  WORKSPACE_MEMBER_DATA_SEED_IDS,
  WORKSPACE_MEMBER_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type OpportunityDataSeed = {
  id: string;
  name: string;
  amountAmountMicros: number;
  amountCurrencyCode: string;
  closeDate: Date;
  stage: string;
  position: number;
  pointOfContactId: string;
  companyId: string;
  ownerId: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
};

export const OPPORTUNITY_DATA_SEED_COLUMNS: (keyof OpportunityDataSeed)[] = [
  'id',
  'name',
  'amountAmountMicros',
  'amountCurrencyCode',
  'closeDate',
  'stage',
  'position',
  'pointOfContactId',
  'companyId',
  'ownerId',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
];

const GENERATE_OPPORTUNITY_IDS = (): Record<string, string> => {
  const OPPORTUNITY_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 50; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    OPPORTUNITY_IDS[`ID_${INDEX}`] =
      `50505050-${HEX_INDEX}-4e7c-8001-123456789abc`;
  }

  return OPPORTUNITY_IDS;
};

export const OPPORTUNITY_DATA_SEED_IDS = GENERATE_OPPORTUNITY_IDS();

// Template permohonan layanan desa
const OPPORTUNITY_TEMPLATES = [
  { name: 'Permohonan Surat Keterangan Tidak Mampu', amount: 0, stage: 'NEW' },
  { name: 'Pembuatan KTP Baru', amount: 0, stage: 'PROPOSAL' },
  { name: 'Penerbitan Akta Kelahiran', amount: 0, stage: 'MEETING' },
  { name: 'Permohonan Surat Domisili Usaha', amount: 150000, stage: 'SCREENING' },
  { name: 'Pengajuan Kartu Keluarga Baru', amount: 0, stage: 'PROPOSAL' },
  { name: 'Pembuatan Surat Pengantar SKCK', amount: 0, stage: 'MEETING' },
  { name: 'Permohonan Surat Keterangan Usaha', amount: 50000, stage: 'NEW' },
  { name: 'Penerbitan Surat Izin Membangun', amount: 500000, stage: 'CUSTOMER' },
  { name: 'Pembuatan Surat Pengantar Nikah', amount: 0, stage: 'PROPOSAL' },
  { name: 'Permohonan Surat Keterangan Pindah', amount: 0, stage: 'MEETING' },
  { name: 'Pengajuan Bantuan PKH', amount: 2400000, stage: 'NEW' },
  { name: 'Permohonan Surat Keterangan Waris', amount: 0, stage: 'SCREENING' },
  { name: 'Pembuatan Akta Kematian', amount: 0, stage: 'PROPOSAL' },
  { name: 'Permohonan Dispensasi Nikah', amount: 0, stage: 'MEETING' },
  { name: 'Pengajuan Perbaikan Rumah RTLH', amount: 17500000, stage: 'CUSTOMER' },
  { name: 'Surat Keterangan Beda Nama', amount: 0, stage: 'NEW' },
  { name: 'Permohonan Izin Keramaian', amount: 100000, stage: 'PROPOSAL' },
  { name: 'Pengajuan Bantuan Modal UMKM', amount: 5000000, stage: 'SCREENING' },
  { name: 'Permohonan Surat Pengantar SIM', amount: 0, stage: 'MEETING' },
  { name: 'Pembuatan Surat Keterangan Tanah', amount: 200000, stage: 'NEW' },
  { name: 'Pengajuan Beasiswa Bidikmisi', amount: 0, stage: 'PROPOSAL' },
  { name: 'Permohonan Surat Izin Usaha Warung', amount: 75000, stage: 'CUSTOMER' },
  { name: 'Pembaruan Data Kartu Keluarga', amount: 0, stage: 'MEETING' },
  { name: 'Pengajuan Sambungan Listrik', amount: 450000, stage: 'SCREENING' },
  { name: 'Permohonan Surat Rekomendasi Usaha', amount: 0, stage: 'NEW' },
  { name: 'Pembuatan Surat Pengantar Berobat', amount: 0, stage: 'PROPOSAL' },
  { name: 'Pengajuan Program Jamban Sehat', amount: 3000000, stage: 'MEETING' },
  { name: 'Permohonan Surat Keterangan Gakin', amount: 0, stage: 'CUSTOMER' },
  { name: 'Penerbitan Surat Keterangan Belum Menikah', amount: 0, stage: 'NEW' },
  { name: 'Pengajuan Kredit KUR Mikro', amount: 25000000, stage: 'PROPOSAL' },
  { name: 'Permohonan Surat Izin Galian', amount: 300000, stage: 'SCREENING' },
  { name: 'Pembuatan Surat Pernyataan Ahli Waris', amount: 0, stage: 'MEETING' },
  { name: 'Pengajuan Bantuan Sembako', amount: 0, stage: 'NEW' },
  { name: 'Permohonan Surat Keterangan Penghasilan', amount: 0, stage: 'CUSTOMER' },
  { name: 'Pembuatan Surat Kuasa Tanah', amount: 100000, stage: 'PROPOSAL' },
  { name: 'Pengajuan BPNT (Bansos Pangan)', amount: 2400000, stage: 'MEETING' },
  { name: 'Permohonan Surat Domisili Organisasi', amount: 0, stage: 'SCREENING' },
  { name: 'Pembuatan Surat Keterangan Kelakuan Baik', amount: 0, stage: 'NEW' },
  { name: 'Pengajuan Rehab Jalan Lingkungan', amount: 45000000, stage: 'PROPOSAL' },
  { name: 'Permohonan Surat Rekomendasi Beasiswa', amount: 0, stage: 'CUSTOMER' },
  { name: 'Pembuatan Surat Pengantar Pindah Sekolah', amount: 0, stage: 'MEETING' },
  { name: 'Pengajuan Kartu Indonesia Pintar', amount: 0, stage: 'NEW' },
  { name: 'Permohonan Legalisir Dokumen', amount: 25000, stage: 'SCREENING' },
  { name: 'Pembuatan Surat Keterangan Bangunan', amount: 150000, stage: 'PROPOSAL' },
  { name: 'Pengajuan Pemasangan PDAM', amount: 750000, stage: 'MEETING' },
  { name: 'Permohonan Surat Keterangan Janda/Duda', amount: 0, stage: 'CUSTOMER' },
  { name: 'Pembuatan Surat Izin Penggunaan Balai Desa', amount: 50000, stage: 'NEW' },
  { name: 'Pengajuan Bantuan Alat Pertanian', amount: 8000000, stage: 'PROPOSAL' },
  { name: 'Permohonan Surat Keterangan Numpang Nikah', amount: 0, stage: 'SCREENING' },
  { name: 'Pembuatan Rekomendasi SIUP Kecil', amount: 100000, stage: 'MEETING' },
];

const GENERATE_OPPORTUNITY_SEEDS = (): OpportunityDataSeed[] => {
  const OPPORTUNITY_SEEDS: OpportunityDataSeed[] = [];

  for (let INDEX = 1; INDEX <= 50; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1) % OPPORTUNITY_TEMPLATES.length;
    const TEMPLATE = OPPORTUNITY_TEMPLATES[TEMPLATE_INDEX];

    const DAYS_AHEAD = Math.floor(Math.random() * 30) + 1;
    const CLOSE_DATE = new Date();

    CLOSE_DATE.setDate(CLOSE_DATE.getDate() + DAYS_AHEAD);

    const workspaceMemberId = Object.values(WORKSPACE_MEMBER_DATA_SEED_IDS)[
      INDEX % 4
    ];
    const workspaceMember = WORKSPACE_MEMBER_DATA_SEEDS.find(
      (workspaceMember) => workspaceMember.id === workspaceMemberId,
    );
    const workspaceMemberName = isDefined(workspaceMember)
      ? `${workspaceMember?.nameFirstName} ${workspaceMember?.nameLastName}`
      : 'Tidak Diketahui';

    const rawSeed: OpportunityDataSeed = {
      id: OPPORTUNITY_DATA_SEED_IDS[`ID_${INDEX}`],
      name: TEMPLATE.name,
      amountAmountMicros: TEMPLATE.amount * 1000000,
      amountCurrencyCode: 'IDR',
      closeDate: CLOSE_DATE,
      stage: TEMPLATE.stage,
      position: INDEX,
      pointOfContactId:
        PERSON_DATA_SEED_IDS[
          `ID_${INDEX}` as keyof typeof PERSON_DATA_SEED_IDS
        ] || PERSON_DATA_SEED_IDS.ID_1,
      companyId:
        COMPANY_DATA_SEED_IDS[
          `ID_${Math.ceil(INDEX / 2)}` as keyof typeof COMPANY_DATA_SEED_IDS
        ] || COMPANY_DATA_SEED_IDS.ID_1,
      ownerId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      createdBySource: 'MANUAL',
      updatedBySource: 'MANUAL',
      createdByWorkspaceMemberId: workspaceMemberId,
      createdByName: workspaceMemberName,
      updatedByWorkspaceMemberId: workspaceMemberId,
      updatedByName: workspaceMemberName,
    };

    const opportunityDataSeedWithSQLColumnOrder: OpportunityDataSeed =
      Object.fromEntries(
        OPPORTUNITY_DATA_SEED_COLUMNS.map((column) => [
          column,
          rawSeed[column as keyof OpportunityDataSeed],
        ]),
      ) as OpportunityDataSeed;

    OPPORTUNITY_SEEDS.push(opportunityDataSeedWithSQLColumnOrder);
  }

  return OPPORTUNITY_SEEDS;
};

export const OPPORTUNITY_DATA_SEEDS = GENERATE_OPPORTUNITY_SEEDS();
