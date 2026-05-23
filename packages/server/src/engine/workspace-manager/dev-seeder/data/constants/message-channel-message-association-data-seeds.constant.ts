import { MESSAGE_CHANNEL_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/message-channel-data-seeds.constant';
import { MESSAGE_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/message-data-seeds.constant';
import { MessageDirection } from 'src/modules/messaging/common/enums/message-direction.enum';

type MessageChannelMessageAssociationDataSeed = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  messageExternalId: string;
  messageThreadExternalId: string;
  messageChannelId: string;
  messageId: string;
  direction: MessageDirection;
};

export const MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_DATA_SEED_COLUMNS: (keyof MessageChannelMessageAssociationDataSeed)[] =
  [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'messageExternalId',
    'messageThreadExternalId',
    'messageChannelId',
    'messageId',
    'direction',
  ];

const GENERATE_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_IDS = (): Record<
  string,
  string
> => {
  const ASSOCIATION_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 600; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    ASSOCIATION_IDS[`ID_${INDEX}`] =
      `20202020-${HEX_INDEX}-4e7c-8001-123456789bcd`;
  }

  return ASSOCIATION_IDS;
};

export const MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_DATA_SEED_IDS =
  GENERATE_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_IDS();

export const MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_DATA_SEEDS: MessageChannelMessageAssociationDataSeed[] =
  [];
