import { type WorkspaceMember } from '@/workspace-member/types/WorkspaceMember';
import { type MessageParticipantRole } from 'shared/types';

export type EmailThreadMessageParticipant = {
  id: string;
  displayName: string;
  handle: string;
  role: MessageParticipantRole;
  messageId: string;
  workspaceMember: WorkspaceMember;
  __typename: 'EmailThreadMessageParticipant';
};
