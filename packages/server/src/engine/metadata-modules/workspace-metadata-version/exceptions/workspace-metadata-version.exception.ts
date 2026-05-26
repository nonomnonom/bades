import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WorkspaceMetadataVersionExceptionCode {
  METADATA_VERSION_NOT_FOUND = 'METADATA_VERSION_NOT_FOUND',
}

const getWorkspaceMetadataVersionExceptionUserFriendlyMessage = (
  code: WorkspaceMetadataVersionExceptionCode,
) => {
  switch (code) {
    case WorkspaceMetadataVersionExceptionCode.METADATA_VERSION_NOT_FOUND:
      return msg`Versi metadata tidak ditemukan.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkspaceMetadataVersionException extends CustomException<WorkspaceMetadataVersionExceptionCode> {
  constructor(
    message: string,
    code: WorkspaceMetadataVersionExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getWorkspaceMetadataVersionExceptionUserFriendlyMessage(code),
    });
  }
}
