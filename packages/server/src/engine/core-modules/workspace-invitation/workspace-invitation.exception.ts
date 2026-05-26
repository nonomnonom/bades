import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WorkspaceInvitationExceptionCode {
  INVALID_APP_TOKEN_TYPE = 'INVALID_APP_TOKEN_TYPE',
  INVITATION_CORRUPTED = 'INVITATION_CORRUPTED',
  INVITATION_ALREADY_EXIST = 'INVITATION_ALREADY_EXIST',
  USER_ALREADY_EXIST = 'USER_ALREADY_EXIST',
  INVALID_INVITATION = 'INVALID_INVITATION',
  EMAIL_MISSING = 'EMAIL_MISSING',
}

const getWorkspaceInvitationExceptionUserFriendlyMessage = (
  code: WorkspaceInvitationExceptionCode,
) => {
  switch (code) {
    case WorkspaceInvitationExceptionCode.INVALID_APP_TOKEN_TYPE:
    case WorkspaceInvitationExceptionCode.INVITATION_CORRUPTED:
    case WorkspaceInvitationExceptionCode.INVALID_INVITATION:
      return msg`Ada masalah dengan undangan Anda. Silakan coba lagi.`;
    case WorkspaceInvitationExceptionCode.INVITATION_ALREADY_EXIST:
      return msg`Undangan sudah dikirim ke email ini.`;
    case WorkspaceInvitationExceptionCode.USER_ALREADY_EXIST:
      return msg`Pengguna ini sudah menjadi anggota workspace.`;
    case WorkspaceInvitationExceptionCode.EMAIL_MISSING:
      return msg`Email wajib diisi.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkspaceInvitationException extends CustomException<WorkspaceInvitationExceptionCode> {
  constructor(
    message: string,
    code: WorkspaceInvitationExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getWorkspaceInvitationExceptionUserFriendlyMessage(code),
    });
  }
}
