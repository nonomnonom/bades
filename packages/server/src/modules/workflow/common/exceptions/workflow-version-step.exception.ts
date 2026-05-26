import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WorkflowVersionStepExceptionCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  CODE_STEP_FAILURE = 'CODE_STEP_FAILURE',
  AI_AGENT_STEP_FAILURE = 'AI_AGENT_STEP_FAILURE',
}

const getWorkflowVersionStepExceptionUserFriendlyMessage = (
  code: WorkflowVersionStepExceptionCode,
) => {
  switch (code) {
    case WorkflowVersionStepExceptionCode.INVALID_REQUEST:
      return msg`Permintaan langkah alur kerja tidak valid.`;
    case WorkflowVersionStepExceptionCode.NOT_FOUND:
      return msg`Langkah alur kerja tidak ditemukan.`;
    case WorkflowVersionStepExceptionCode.CODE_STEP_FAILURE:
      return msg`Eksekusi langkah kode gagal.`;
    case WorkflowVersionStepExceptionCode.AI_AGENT_STEP_FAILURE:
      return msg`Eksekusi langkah AI agent gagal.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkflowVersionStepException extends CustomException<WorkflowVersionStepExceptionCode> {
  constructor(
    message: string,
    code: WorkflowVersionStepExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getWorkflowVersionStepExceptionUserFriendlyMessage(code),
    });
  }
}
