import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WorkflowRunExceptionCode {
  WORKFLOW_RUN_NOT_FOUND = 'WORKFLOW_RUN_NOT_FOUND',
  WORKFLOW_ROOT_STEP_NOT_FOUND = 'WORKFLOW_ROOT_STEP_NOT_FOUND',
  INVALID_OPERATION = 'INVALID_OPERATION',
  INVALID_INPUT = 'INVALID_INPUT',
  WORKFLOW_RUN_LIMIT_REACHED = 'WORKFLOW_RUN_LIMIT_REACHED',
  WORKFLOW_RUN_INVALID = 'WORKFLOW_RUN_INVALID',
}

const getWorkflowRunExceptionUserFriendlyMessage = (
  code: WorkflowRunExceptionCode,
) => {
  switch (code) {
    case WorkflowRunExceptionCode.WORKFLOW_RUN_NOT_FOUND:
      return msg`Proses alur kerja tidak ditemukan.`;
    case WorkflowRunExceptionCode.WORKFLOW_ROOT_STEP_NOT_FOUND:
      return msg`Langkah root alur kerja tidak ditemukan.`;
    case WorkflowRunExceptionCode.INVALID_OPERATION:
      return msg`Operasi alur kerja tidak valid.`;
    case WorkflowRunExceptionCode.INVALID_INPUT:
      return msg`Input alur kerja tidak valid.`;
    case WorkflowRunExceptionCode.WORKFLOW_RUN_LIMIT_REACHED:
      return msg`Batas proses alur kerja tercapai.`;
    case WorkflowRunExceptionCode.WORKFLOW_RUN_INVALID:
      return msg`Proses alur kerja tidak valid.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkflowRunException extends CustomException<WorkflowRunExceptionCode> {
  constructor(
    message: string,
    code: WorkflowRunExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getWorkflowRunExceptionUserFriendlyMessage(code),
    });
  }
}
