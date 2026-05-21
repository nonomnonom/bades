import { CalendarChannelVisibility } from 'shared/types';
import { CONNECTED_ACCOUNT_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/connected-account-data-seeds.constant';

type CalendarChannelDataSeed = {
  id: string;
  connectedAccountId: string;
  handle: string;
  visibility: CalendarChannelVisibility;
  isContactAutoCreationEnabled: boolean;
  isSyncEnabled: boolean;
};

export const CALENDAR_CHANNEL_DATA_SEED_COLUMNS: (keyof CalendarChannelDataSeed)[] =
  [
    'id',
    'connectedAccountId',
    'handle',
    'visibility',
    'isContactAutoCreationEnabled',
    'isSyncEnabled',
  ];

const GENERATE_CALENDAR_CHANNEL_IDS = (): Record<string, string> => {
  const CHANNEL_IDS: Record<string, string> = {};

  CHANNEL_IDS['KADES'] = '20202020-a40f-4faf-bb9f-c6f9945b8203';
  CHANNEL_IDS['SEKDES'] = '20202020-a40f-4faf-bb9f-c6f9945b8204';
  CHANNEL_IDS['KAUR'] = '20202020-a40f-4faf-bb9f-c6f9945b8205';
  CHANNEL_IDS['KASI'] = '20202020-a40f-4faf-bb9f-c6f9945b8208';
  CHANNEL_IDS['COMPANY_MAIN'] = '20202020-a40f-4faf-bb9f-c6f9945b8206';
  CHANNEL_IDS['TEAM_CALENDAR'] = '20202020-a40f-4faf-bb9f-c6f9945b8207';

  return CHANNEL_IDS;
};

export const CALENDAR_CHANNEL_DATA_SEED_IDS = GENERATE_CALENDAR_CHANNEL_IDS();

export const CALENDAR_CHANNEL_DATA_SEEDS: CalendarChannelDataSeed[] = [
  {
    id: CALENDAR_CHANNEL_DATA_SEED_IDS.KADES,
    connectedAccountId: CONNECTED_ACCOUNT_DATA_SEED_IDS.KADES,
    handle: 'kades@sukamaju.desa.id',
    visibility: CalendarChannelVisibility.METADATA,
    isContactAutoCreationEnabled: true,
    isSyncEnabled: false,
  },
  {
    id: CALENDAR_CHANNEL_DATA_SEED_IDS.SEKDES,
    connectedAccountId: CONNECTED_ACCOUNT_DATA_SEED_IDS.SEKDES,
    handle: 'sekdes@sukamaju.desa.id',
    visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
    isContactAutoCreationEnabled: true,
    isSyncEnabled: false,
  },
  {
    id: CALENDAR_CHANNEL_DATA_SEED_IDS.KAUR,
    connectedAccountId: CONNECTED_ACCOUNT_DATA_SEED_IDS.KAUR,
    handle: 'kaur@sukamaju.desa.id',
    visibility: CalendarChannelVisibility.METADATA,
    isContactAutoCreationEnabled: true,
    isSyncEnabled: false,
  },
  {
    id: CALENDAR_CHANNEL_DATA_SEED_IDS.KASI,
    connectedAccountId: CONNECTED_ACCOUNT_DATA_SEED_IDS.KASI,
    handle: 'kasi@sukamaju.desa.id',
    visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
    isContactAutoCreationEnabled: true,
    isSyncEnabled: false,
  },
  {
    id: CALENDAR_CHANNEL_DATA_SEED_IDS.COMPANY_MAIN,
    connectedAccountId: CONNECTED_ACCOUNT_DATA_SEED_IDS.KADES,
    handle: 'kalender@sukamaju.desa.id',
    visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
    isContactAutoCreationEnabled: true,
    isSyncEnabled: false,
  },
  {
    id: CALENDAR_CHANNEL_DATA_SEED_IDS.TEAM_CALENDAR,
    connectedAccountId: CONNECTED_ACCOUNT_DATA_SEED_IDS.KADES,
    handle: 'perangkat@sukamaju.desa.id',
    visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
    isContactAutoCreationEnabled: true,
    isSyncEnabled: false,
  },
];
