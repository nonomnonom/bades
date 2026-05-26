import { type WorkspaceMember } from '~/generated-metadata/graphql';

export type CalendarEventParticipant = {
  id: string;
  handle: string;
  isOrganizer: boolean;
  displayName: string;
  workspaceMember?: WorkspaceMember;
  responseStatus: 'ACCEPTED' | 'DECLINED' | 'NEEDS_ACTION' | 'TENTATIVE';
};
