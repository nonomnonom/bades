import { type QueryRunner } from 'typeorm';

import {
  CalendarChannelVisibility,
  MessageChannelSyncStage,
  MessageChannelType,
  MessageChannelVisibility,
  MessageFolderPendingSyncAction,
} from 'shared/types';

import {
  SEED_APPLE_WORKSPACE_ID,
  SEED_YCOMBINATOR_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { USER_WORKSPACE_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-user-workspaces.util';
import { CALENDAR_CHANNEL_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/calendar-channel-data-seeds.constant';
import { CONNECTED_ACCOUNT_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/connected-account-data-seeds.constant';
import { MESSAGE_CHANNEL_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/message-channel-data-seeds.constant';
import { MESSAGE_FOLDER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/message-folder-data-seeds.constant';

type SeedMetadataEntitiesArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

// YC workspace needs its own entity IDs since core tables have a single PK
const YC_CONNECTED_ACCOUNT_IDS = {
  KADES: '30303030-9ac0-4390-9a1a-ab4d2c4e1bb7',
  SEKDES: '30303030-0cc8-4d60-a3a4-803245698908',
  KAUR: '30303030-cafc-4323-908d-e5b42ad69fdf',
  KASI: '30303030-b5c7-46f0-bf5c-3f4e4b3f7c1a',
  JANE_DELETABLE: '30303030-d1e5-4a8f-9c3b-7f6d5e4c3b2a',
};

const YC_MESSAGE_CHANNEL_IDS = {
  KADES: '30303030-9b80-4c2c-a597-383db48de1d6',
  SEKDES: '30303030-5ffe-4b32-814a-983d5e4911cd',
  KAUR: '30303030-e2f1-49b5-85d2-5d3a3386990c',
  KASI: '30303030-8c4d-4e71-a672-2e6a8c9f1b3d',
  SUPPORT: '30303030-e2f1-49b5-85d2-5d3a3386990d',
  SALES: '30303030-e2f1-49b5-85d2-5d3a3386990e',
};

const YC_CALENDAR_CHANNEL_IDS = {
  KADES: '30303030-a40f-4faf-bb9f-c6f9945b8203',
  SEKDES: '30303030-a40f-4faf-bb9f-c6f9945b8204',
  KAUR: '30303030-a40f-4faf-bb9f-c6f9945b8205',
  KASI: '30303030-a40f-4faf-bb9f-c6f9945b8208',
  COMPANY_MAIN: '30303030-a40f-4faf-bb9f-c6f9945b8206',
  TEAM_CALENDAR: '30303030-a40f-4faf-bb9f-c6f9945b8207',
};

const YC_MESSAGE_FOLDER_IDS = {
  TIM_INBOX: '30303030-1234-4567-8901-abcdef012345',
  TIM_SENT: '30303030-1234-4567-8901-abcdef012349',
  JONY_INBOX: '30303030-1234-4567-8901-abcdef012346',
  JANE_INBOX: '30303030-1234-4567-8901-abcdef012347',
  JANE_SENT: '30303030-1234-4567-8901-abcdef012348',
};

type WorkspaceSeedIds = {
  userWorkspaceIds: {
  KADES: string;
  SEKDES: string;
  KAUR: string;
  KASI: string;
  };
  connectedAccountIds: typeof CONNECTED_ACCOUNT_DATA_SEED_IDS;
  messageChannelIds: typeof MESSAGE_CHANNEL_DATA_SEED_IDS;
  calendarChannelIds: typeof CALENDAR_CHANNEL_DATA_SEED_IDS;
  messageFolderIds: typeof MESSAGE_FOLDER_DATA_SEED_IDS;
};

const getSeedIds = (workspaceId: string): WorkspaceSeedIds => {
  if (workspaceId === SEED_YCOMBINATOR_WORKSPACE_ID) {
    return {
      userWorkspaceIds: {
  KADES: USER_WORKSPACE_DATA_SEED_IDS.KADES_ACME,
  SEKDES: USER_WORKSPACE_DATA_SEED_IDS.SEKDES_ACME,
  KAUR: USER_WORKSPACE_DATA_SEED_IDS.KAUR_ACME,
  KASI: USER_WORKSPACE_DATA_SEED_IDS.KASI_ACME,
      },
      connectedAccountIds: YC_CONNECTED_ACCOUNT_IDS,
      messageChannelIds: YC_MESSAGE_CHANNEL_IDS,
      calendarChannelIds: YC_CALENDAR_CHANNEL_IDS,
      messageFolderIds: YC_MESSAGE_FOLDER_IDS,
    };
  }

  return {
    userWorkspaceIds: {
  KADES: USER_WORKSPACE_DATA_SEED_IDS.KADES,
  SEKDES: USER_WORKSPACE_DATA_SEED_IDS.SEKDES,
  KAUR: USER_WORKSPACE_DATA_SEED_IDS.KAUR,
  KASI: USER_WORKSPACE_DATA_SEED_IDS.KASI,
    },
    connectedAccountIds: CONNECTED_ACCOUNT_DATA_SEED_IDS,
    messageChannelIds: MESSAGE_CHANNEL_DATA_SEED_IDS,
    calendarChannelIds: CALENDAR_CHANNEL_DATA_SEED_IDS,
    messageFolderIds: MESSAGE_FOLDER_DATA_SEED_IDS,
  };
};

export const seedMetadataEntities = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedMetadataEntitiesArgs) => {
  if (
    workspaceId !== SEED_APPLE_WORKSPACE_ID &&
    workspaceId !== SEED_YCOMBINATOR_WORKSPACE_ID
  ) {
    return;
  }

  await seedConnectedAccounts({ queryRunner, schemaName, workspaceId });
  await seedMessageChannels({ queryRunner, schemaName, workspaceId });
  await seedCalendarChannels({ queryRunner, schemaName, workspaceId });
  await seedMessageFolders({ queryRunner, schemaName, workspaceId });
};

const seedConnectedAccounts = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedMetadataEntitiesArgs) => {
  const ids = getSeedIds(workspaceId);

  const connectedAccounts = [
    {
      id: ids.connectedAccountIds.KADES,
      handle: 'kades@sukamaju.desa.id',
      provider: 'google',
      userWorkspaceId: ids.userWorkspaceIds.KADES,
      workspaceId,
    },
    {
      id: ids.connectedAccountIds.SEKDES,
      handle: 'sekdes@sukamaju.desa.id',
      provider: 'google',
      userWorkspaceId: ids.userWorkspaceIds.SEKDES,
      workspaceId,
    },
    {
      id: ids.connectedAccountIds.KAUR,
      handle: 'kaur@sukamaju.desa.id',
      provider: 'google',
      userWorkspaceId: ids.userWorkspaceIds.KAUR,
      workspaceId,
    },
    {
      id: ids.connectedAccountIds.KASI,
      handle: 'kasi@sukamaju.desa.id',
      provider: 'google',
      userWorkspaceId: ids.userWorkspaceIds.KASI,
      workspaceId,
    },
    {
      id: ids.connectedAccountIds.JANE_DELETABLE,
      handle: 'kasi-deletable@sukamaju.desa.id',
      provider: 'google',
      userWorkspaceId: ids.userWorkspaceIds.KASI,
      workspaceId,
    },
  ];

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.connectedAccount`, [
      'id',
      'handle',
      'provider',
      'userWorkspaceId',
      'workspaceId',
    ])
    .orIgnore()
    .values(connectedAccounts)
    .execute();
};

const seedMessageChannels = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedMetadataEntitiesArgs) => {
  const ids = getSeedIds(workspaceId);

  const messageChannels = [
    {
      id: ids.messageChannelIds.KADES,
      handle: 'kades@sukamaju.desa.id',
      visibility: MessageChannelVisibility.SHARE_EVERYTHING,
      type: MessageChannelType.EMAIL,
      syncStage: MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
      messageFolderImportPolicy: 'ALL_FOLDERS',
      excludeNonProfessionalEmails: false,
      excludeGroupEmails: false,
      pendingGroupEmailsAction: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KADES,
      workspaceId,
    },
    {
      id: ids.messageChannelIds.SEKDES,
      handle: 'sekdes@sukamaju.desa.id',
      visibility: MessageChannelVisibility.SHARE_EVERYTHING,
      type: MessageChannelType.EMAIL,
      syncStage: MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
      messageFolderImportPolicy: 'ALL_FOLDERS',
      excludeNonProfessionalEmails: false,
      excludeGroupEmails: false,
      pendingGroupEmailsAction: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.SEKDES,
      workspaceId,
    },
    {
      id: ids.messageChannelIds.KAUR,
      handle: 'kaur@sukamaju.desa.id',
      visibility: MessageChannelVisibility.SHARE_EVERYTHING,
      type: MessageChannelType.EMAIL,
      syncStage: MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
      messageFolderImportPolicy: 'ALL_FOLDERS',
      excludeNonProfessionalEmails: false,
      excludeGroupEmails: false,
      pendingGroupEmailsAction: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KAUR,
      workspaceId,
    },
    {
      id: ids.messageChannelIds.KASI,
      handle: 'kasi@sukamaju.desa.id',
      visibility: MessageChannelVisibility.SHARE_EVERYTHING,
      type: MessageChannelType.EMAIL,
      syncStage: MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
      messageFolderImportPolicy: 'ALL_FOLDERS',
      excludeNonProfessionalEmails: false,
      excludeGroupEmails: false,
      pendingGroupEmailsAction: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KASI,
      workspaceId,
    },
    {
      id: ids.messageChannelIds.SUPPORT,
      handle: 'layanan@sukamaju.desa.id',
      visibility: MessageChannelVisibility.SHARE_EVERYTHING,
      type: MessageChannelType.EMAIL,
      syncStage: MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
      messageFolderImportPolicy: 'ALL_FOLDERS',
      excludeNonProfessionalEmails: false,
      excludeGroupEmails: false,
      pendingGroupEmailsAction: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KADES,
      workspaceId,
    },
    {
      id: ids.messageChannelIds.SALES,
      handle: 'admin@sukamaju.desa.id',
      visibility: MessageChannelVisibility.SHARE_EVERYTHING,
      type: MessageChannelType.EMAIL,
      syncStage: MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
      messageFolderImportPolicy: 'ALL_FOLDERS',
      excludeNonProfessionalEmails: false,
      excludeGroupEmails: false,
      pendingGroupEmailsAction: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KADES,
      workspaceId,
    },
  ];

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.messageChannel`, [
      'id',
      'handle',
      'visibility',
      'type',
      'syncStage',
      'isContactAutoCreationEnabled',
      'contactAutoCreationPolicy',
      'messageFolderImportPolicy',
      'excludeNonProfessionalEmails',
      'excludeGroupEmails',
      'pendingGroupEmailsAction',
      'isSyncEnabled',
      'connectedAccountId',
      'workspaceId',
    ])
    .orIgnore()
    .values(messageChannels)
    .execute();
};

const seedCalendarChannels = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedMetadataEntitiesArgs) => {
  const ids = getSeedIds(workspaceId);

  const calendarChannels = [
    {
      id: ids.calendarChannelIds.KADES,
      handle: 'kades@sukamaju.desa.id',
      visibility: CalendarChannelVisibility.METADATA,
      syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KADES,
      workspaceId,
    },
    {
      id: ids.calendarChannelIds.SEKDES,
      handle: 'sekdes@sukamaju.desa.id',
      visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
      syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.SEKDES,
      workspaceId,
    },
    {
      id: ids.calendarChannelIds.KAUR,
      handle: 'kaur@sukamaju.desa.id',
      visibility: CalendarChannelVisibility.METADATA,
      syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KAUR,
      workspaceId,
    },
    {
      id: ids.calendarChannelIds.KASI,
      handle: 'kasi@sukamaju.desa.id',
      visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
      syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KASI,
      workspaceId,
    },
    {
      id: ids.calendarChannelIds.COMPANY_MAIN,
      handle: 'kalender@sukamaju.desa.id',
      visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
      syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KADES,
      workspaceId,
    },
    {
      id: ids.calendarChannelIds.TEAM_CALENDAR,
      handle: 'perangkat@sukamaju.desa.id',
      visibility: CalendarChannelVisibility.SHARE_EVERYTHING,
      syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
      isContactAutoCreationEnabled: true,
      contactAutoCreationPolicy: 'NONE',
      isSyncEnabled: true,
      connectedAccountId: ids.connectedAccountIds.KADES,
      workspaceId,
    },
  ];

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.calendarChannel`, [
      'id',
      'handle',
      'visibility',
      'syncStage',
      'isContactAutoCreationEnabled',
      'contactAutoCreationPolicy',
      'isSyncEnabled',
      'connectedAccountId',
      'workspaceId',
    ])
    .orIgnore()
    .values(calendarChannels)
    .execute();
};

const seedMessageFolders = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedMetadataEntitiesArgs) => {
  const ids = getSeedIds(workspaceId);

  const messageFolders = [
    {
      id: ids.messageFolderIds.TIM_INBOX,
      name: 'INBOX',
      isSynced: true,
      isSentFolder: false,
      messageChannelId: ids.messageChannelIds.KADES,
      workspaceId,
      pendingSyncAction: MessageFolderPendingSyncAction.NONE,
    },
    {
      id: ids.messageFolderIds.JONY_INBOX,
      name: 'INBOX',
      isSynced: true,
      isSentFolder: false,
      messageChannelId: ids.messageChannelIds.SEKDES,
      workspaceId,
      pendingSyncAction: MessageFolderPendingSyncAction.NONE,
    },
    {
      id: ids.messageFolderIds.JANE_INBOX,
      name: 'INBOX',
      isSynced: true,
      isSentFolder: false,
      messageChannelId: ids.messageChannelIds.KASI,
      workspaceId,
      pendingSyncAction: MessageFolderPendingSyncAction.NONE,
    },
    {
      id: ids.messageFolderIds.JANE_SENT,
      name: 'Sent',
      isSynced: true,
      isSentFolder: true,
      messageChannelId: ids.messageChannelIds.KASI,
      workspaceId,
      pendingSyncAction: MessageFolderPendingSyncAction.NONE,
    },
  ];

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.messageFolder`, [
      'id',
      'name',
      'isSynced',
      'isSentFolder',
      'messageChannelId',
      'workspaceId',
      'pendingSyncAction',
    ])
    .orIgnore()
    .values(messageFolders)
    .execute();
};
