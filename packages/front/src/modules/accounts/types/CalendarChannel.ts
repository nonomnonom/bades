import {
  type CalendarChannelContactAutoCreationPolicy,
  type CalendarChannelSyncStage,
  type CalendarChannelSyncStatus,
} from 'shared/types';

// Enum kalender visibility — type metadata di-remove dari schema GraphQL
// (commit 7f57dae5), tetapi UI calendar settings masih hidup. Definisi lokal
// untuk menjaga komponen tetap kompil. Hapus saat fitur kalender benar-benar
// dibersihkan.
export enum CalendarChannelVisibility {
  METADATA = 'METADATA',
  SHARE_EVERYTHING = 'SHARE_EVERYTHING',
}

export type CalendarChannel = {
  id: string;
  handle: string;
  visibility: CalendarChannelVisibility;
  isContactAutoCreationEnabled: boolean;
  contactAutoCreationPolicy: CalendarChannelContactAutoCreationPolicy;
  isSyncEnabled: boolean;
  syncStatus: CalendarChannelSyncStatus;
  syncStage: CalendarChannelSyncStage;
  syncStageStartedAt: string | null;
  connectedAccountId: string;
  createdAt: string;
  updatedAt: string;
  __typename: 'CalendarChannel';
};
