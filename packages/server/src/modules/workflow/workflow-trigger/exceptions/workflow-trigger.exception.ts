import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { STANDARD_ERROR_MESSAGE } from 'src/engine/api/common/common-query-runners/errors/standard-error-message.constant';
import { CustomException } from 'src/utils/custom-exception';

export enum WorkflowTriggerExceptionCode {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_WORKFLOW_TRIGGER = 'INVALID_WORKFLOW_TRIGGER',
  INVALID_WORKFLOW_VERSION = 'INVALID_WORKFLOW_VERSION',
  INVALID_WORKFLOW_STATUS = 'INVALID_WORKFLOW_STATUS',
  INVALID_ACTION_TYPE = 'INVALID_ACTION_TYPE',
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

const getWorkflowTriggerExceptionUserFriendlyMessage = (
  code: WorkflowTriggerExceptionCode,
) => {
  switch (code) {
    case WorkflowTriggerExceptionCode.INVALID_INPUT:
      return msg`Input pemicu alur kerja tidak valid.`;
    case WorkflowTriggerExceptionCode.INVALID_WORKFLOW_TRIGGER:
      return msg`Konfigurasi pemicu alur kerja tidak valid.`;
    case WorkflowTriggerExceptionCode.INVALID_WORKFLOW_VERSION:
      return msg`Versi alur kerja tidak valid.`;
    case WorkflowTriggerExceptionCode.INVALID_WORKFLOW_STATUS:
      return msg`Status alur kerja tidak valid.`;
    case WorkflowTriggerExceptionCode.INVALID_ACTION_TYPE:
      return msg`Tipe aksi tidak valid.`;
    case WorkflowTriggerExceptionCode.NOT_FOUND:
      return msg`Alur kerja tidak ditemukan.`;
    case WorkflowTriggerExceptionCode.FORBIDDEN:
      return msg`Anda tidak memiliki izin untuk mengakses alur kerja ini.`;
    case WorkflowTriggerExceptionCode.INTERNAL_ERROR:
      return STANDARD_ERROR_MESSAGE;
    default:
      assertUnreachable(code);
  }
};

export class WorkflowTriggerException extends CustomException<WorkflowTriggerExceptionCode> {
  constructor(
    message: string,
    code: WorkflowTriggerExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getWorkflowTriggerExceptionUserFriendlyMessage(code),
    });
  }
}
