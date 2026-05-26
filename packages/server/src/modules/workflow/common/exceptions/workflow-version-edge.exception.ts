import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WorkflowVersionEdgeExceptionCode {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_REQUEST = 'INVALID_REQUEST',
}

const getWorkflowVersionEdgeExceptionUserFriendlyMessage = (
  code: WorkflowVersionEdgeExceptionCode,
) => {
  switch (code) {
    case WorkflowVersionEdgeExceptionCode.NOT_FOUND:
      return msg`Edge alur kerja tidak ditemukan.`;
    case WorkflowVersionEdgeExceptionCode.INVALID_REQUEST:
      return msg`Permintaan edge alur kerja tidak valid.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkflowVersionEdgeException extends CustomException<WorkflowVersionEdgeExceptionCode> {
  constructor(
    message: string,
    code: WorkflowVersionEdgeExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getWorkflowVersionEdgeExceptionUserFriendlyMessage(code),
    });
  }
}
