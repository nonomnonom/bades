import {
  type MessageChannelType,
  type MessageChannelContactAutoCreationPolicy,
  type MessageChannelSyncStage,
  type MessageChannelSyncStatus,
  type MessageFolderImportPolicy,
} from 'shared/types';

// Enum message visibility — di-remove dari schema GraphQL utama
// (commit 7f57dae5) tetapi UI message threads masih hidup.
export enum MessageChannelVisibility {
  METADATA = 'METADATA',
  SUBJECT = 'SUBJECT',
  SHARE_EVERYTHING = 'SHARE_EVERYTHING',
}

export type MessageChannel = {
  id: string;
  handle: string;
  visibility: MessageChannelVisibility;
  type: MessageChannelType;
  isContactAutoCreationEnabled: boolean;
  contactAutoCreationPolicy: MessageChannelContactAutoCreationPolicy;
  messageFolderImportPolicy: MessageFolderImportPolicy;
  excludeNonProfessionalEmails: boolean;
  excludeGroupEmails: boolean;
  isSyncEnabled: boolean;
  syncStatus: MessageChannelSyncStatus;
  syncStage: MessageChannelSyncStage;
  syncStageStartedAt: string | null;
  connectedAccountId: string;
  connectedAccount: {
    id: string;
    handle: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  __typename: 'MessageChannel';
};
