import { PAGE_LAYOUT_SEEDS } from 'src/engine/workspace-manager/dev-seeder/core/constants/page-layout-seeds.constant';
import { generateSeedId } from 'src/engine/workspace-manager/dev-seeder/core/utils/generate-seed-id.util';
import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type DashboardDataSeed = {
  id: string;
  title: string;
  pageLayoutId: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  position: number;
};

export const DASHBOARD_DATA_SEED_COLUMNS: (keyof DashboardDataSeed)[] = [
  'id',
  'title',
  'pageLayoutId',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
  'position',
];

export const DASHBOARD_DATA_SEED_IDS = {
  LAYANAN_DESA: '20202020-9e82-4342-91ef-c9e70f16a675',
  DATA_WARGA: '20202020-d64e-4588-98cc-c56ba821247b',
  KINERJA_PERANGKAT: '20202020-b888-4c58-8975-76b4c2035d3a',
};

export const getDashboardDataSeeds = (
  workspaceId: string,
): DashboardDataSeed[] => [
  {
    id: DASHBOARD_DATA_SEED_IDS.LAYANAN_DESA,
    title: 'Layanan Desa',
    pageLayoutId: generateSeedId(
      workspaceId,
      PAGE_LAYOUT_SEEDS.LAYANAN_DESA_DASHBOARD,
    ),
    createdBySource: 'MANUAL',
    createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
    createdByName: 'Drs. H. Abdullah',
    updatedBySource: 'MANUAL',
    updatedByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
    updatedByName: 'Drs. H. Abdullah',
    position: 0,
  },
  {
    id: DASHBOARD_DATA_SEED_IDS.DATA_WARGA,
    title: 'Data Warga',
    pageLayoutId: generateSeedId(
      workspaceId,
      PAGE_LAYOUT_SEEDS.KEPENDUDUKAN_DASHBOARD,
    ),
    createdBySource: 'MANUAL',
    createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    createdByName: 'Ahmad Hidayat',
    updatedBySource: 'MANUAL',
    updatedByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES,
    updatedByName: 'Ahmad Hidayat',
    position: 1,
  },
  {
    id: DASHBOARD_DATA_SEED_IDS.KINERJA_PERANGKAT,
    title: 'Kinerja Perangkat Desa',
    pageLayoutId: generateSeedId(workspaceId, PAGE_LAYOUT_SEEDS.TEAM_DASHBOARD),
    createdBySource: 'MANUAL',
    createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KAUR,
    createdByName: 'Dewi Lestari',
    updatedBySource: 'MANUAL',
    updatedByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KAUR,
    updatedByName: 'Dewi Lestari',
    position: 2,
  },
];
