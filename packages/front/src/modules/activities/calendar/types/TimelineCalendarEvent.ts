import { type CalendarChannelVisibility } from '@/accounts/types/CalendarChannel';

export type TimelineCalendarEventParticipant = {
  __typename?: 'TimelineCalendarEventParticipant';
  personId: string | null;
  workspaceMemberId: string | null;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string;
  handle: string;
};

// TimelineCalendarEvent — type metadata di-remove dari schema GraphQL
// (commit 7f57dae5), tetapi UI calendar masih hidup. Definisi lokal
// untuk menjaga komponen tetap kompil. Hapus saat fitur kalender benar-benar
// dibersihkan.
export type TimelineCalendarEvent = {
  __typename?: 'TimelineCalendarEvent';
  id: string;
  title?: string;
  description?: string;
  location?: string;
  startsAt: string;
  endsAt: string;
  conferenceLink?: {
    primaryLinkUrl: string;
    primaryLinkLabel: string;
    __typename?: string;
  } | null;
  conferenceSolution?: string;
  isCanceled: boolean;
  visibility: CalendarChannelVisibility;
  isFullDay: boolean;
  participants: TimelineCalendarEventParticipant[];
};
