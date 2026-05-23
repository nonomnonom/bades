import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WorkflowQueryValidationExceptionCode {
  FORBIDDEN = 'FORBIDDEN',
}

const getWorkflowQueryValidationExceptionUserFriendlyMessage = (
  code: WorkflowQueryValidationExceptionCode,
) => {
  switch (code) {
    case WorkflowQueryValidationExceptionCode.FORBIDDEN:
      return msg`You do not have permission to perform this workflow action.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkflowQueryValidationException extends CustomException<WorkflowQueryValidationExceptionCode> {
  constructor(
    message: string,
    code: WorkflowQueryValidationExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getWorkflowQueryValidationExceptionUserFriendlyMessage(code),
    });
  }
}
