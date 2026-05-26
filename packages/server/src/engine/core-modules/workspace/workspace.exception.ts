import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WorkspaceExceptionCode {
  SUBDOMAIN_NOT_FOUND = 'SUBDOMAIN_NOT_FOUND',
  SUBDOMAIN_ALREADY_TAKEN = 'SUBDOMAIN_ALREADY_TAKEN',
  SUBDOMAIN_NOT_VALID = 'SUBDOMAIN_NOT_VALID',
  DOMAIN_ALREADY_TAKEN = 'DOMAIN_ALREADY_TAKEN',
  WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
  WORKSPACE_CUSTOM_DOMAIN_DISABLED = 'WORKSPACE_CUSTOM_DOMAIN_DISABLED',
  ENVIRONMENT_VAR_NOT_ENABLED = 'ENVIRONMENT_VAR_NOT_ENABLED',
  CUSTOM_DOMAIN_NOT_FOUND = 'CUSTOM_DOMAIN_NOT_FOUND',
}

const getWorkspaceExceptionUserFriendlyMessage = (
  code: WorkspaceExceptionCode,
) => {
  switch (code) {
    case WorkspaceExceptionCode.SUBDOMAIN_NOT_FOUND:
      return msg`Subdomain tidak ditemukan.`;
    case WorkspaceExceptionCode.SUBDOMAIN_ALREADY_TAKEN:
      return msg`Subdomain ini sudah digunakan.`;
    case WorkspaceExceptionCode.SUBDOMAIN_NOT_VALID:
      return msg`Subdomain tidak valid.`;
    case WorkspaceExceptionCode.DOMAIN_ALREADY_TAKEN:
      return msg`Domain ini sudah digunakan.`;
    case WorkspaceExceptionCode.WORKSPACE_NOT_FOUND:
      return msg`Workspace tidak ditemukan.`;
    case WorkspaceExceptionCode.WORKSPACE_CUSTOM_DOMAIN_DISABLED:
      return msg`Domain kustom dinonaktifkan untuk workspace ini.`;
    case WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED:
      return msg`Fitur ini tidak diaktifkan.`;
    case WorkspaceExceptionCode.CUSTOM_DOMAIN_NOT_FOUND:
      return msg`Domain kustom tidak ditemukan.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkspaceException extends CustomException<WorkspaceExceptionCode> {
  constructor(
    message: string,
    code: WorkspaceExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getWorkspaceExceptionUserFriendlyMessage(code),
    });
  }
}

export const WorkspaceNotFoundDefaultError = new WorkspaceException(
  'Workspace not found',
  WorkspaceExceptionCode.WORKSPACE_NOT_FOUND,
);
