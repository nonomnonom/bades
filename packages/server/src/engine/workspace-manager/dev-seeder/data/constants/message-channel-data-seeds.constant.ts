import {
  MessageChannelSyncStage,
  MessageChannelType,
  MessageChannelVisibility,
} from 'shared/types';
import { CONNECTED_ACCOUNT_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/connected-account-data-seeds.constant';

type MessageChannelDataSeed = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isContactAutoCreationEnabled: boolean;
  type: MessageChannelType;
  connectedAccountId: string;
  handle: string;
  isSyncEnabled: boolean;
  visibility: MessageChannelVisibility;
  syncStage: MessageChannelSyncStage;
};

export const MESSAGE_CHANNEL_DATA_SEED_COLUMNS: (keyof MessageChannelDataSeed)[] =
  [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'isContactAutoCreationEnabled',
    'type',
    'connectedAccountId',
    'handle',
    'isSyncEnabled',
    'visibility',
    'syncStage',
  ];

const GENERATE_MESSAGE_CHANNEL_IDS = (): Record<string, string> => {
  const CHANNEL_IDS: Record<string, string> = {};

  CHANNEL_IDS['KADES'] = '20202020-9b80-4c2c-a597-383db48de1d6';
  CHANNEL_IDS['SEKDES'] = '20202020-5ffe-4b32-814a-983d5e4911cd';
  CHANNEL_IDS['KAUR'] = '20202020-e2f1-49b5-85d2-5d3a3386990c';
  CHANNEL_IDS['KASI'] = '20202020-8c4d-4e71-a672-2e6a8c9f1b3d';
  CHANNEL_IDS['SUPPORT'] = '20202020-e2f1-49b5-85d2-5d3a3386990d';
  CHANNEL_IDS['SALES'] = '20202020-e2f1-49b5-85d2-5d3a3386990e';

  return CHANNEL_IDS;
};

export const MESSAGE_CHANNEL_DATA_SEED_IDS = GENERATE_MESSAGE_CHANNEL_IDS();

export const MESSAGE_CHANNEL_DATA_SEEDS: MessageChannelDataSeed[] = [];
