import { type MessageChannelVisibility } from '@/accounts/types/MessageChannel';

// TimelineThread — type metadata di-remove dari schema GraphQL
// (commit 7f57dae5), tetapi UI email threads masih hidup. Definisi lokal
// untuk menjaga komponen tetap kompil. Hapus saat fitur email benar-benar
// dibersihkan.
export type TimelineThread = {
  __typename?: 'TimelineThread';
  id: string;
  read: boolean;
  visibility: MessageChannelVisibility;
  firstParticipant: {
    displayName: string;
    avatarUrl: string;
    workspaceMemberId?: string | null;
    personId?: string | null;
  };
  lastTwoParticipants: Array<{
    displayName: string;
    avatarUrl: string;
    workspaceMemberId?: string | null;
    personId?: string | null;
  }>;
  participantCount: number;
  subject: string;
  lastMessageBody: string;
  numberOfMessagesInThread: number;
  lastMessageReceivedAt: string;
};
