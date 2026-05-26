import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum LogicFunctionExceptionCode {
  LOGIC_FUNCTION_NOT_FOUND = 'LOGIC_FUNCTION_NOT_FOUND',
  LOGIC_FUNCTION_ALREADY_EXIST = 'LOGIC_FUNCTION_ALREADY_EXIST',
  LOGIC_FUNCTION_NOT_READY = 'LOGIC_FUNCTION_NOT_READY',
  LOGIC_FUNCTION_BUILDING = 'LOGIC_FUNCTION_BUILDING',
  LOGIC_FUNCTION_CODE_UNCHANGED = 'LOGIC_FUNCTION_CODE_UNCHANGED',
  LOGIC_FUNCTION_EXECUTION_LIMIT_REACHED = 'LOGIC_FUNCTION_EXECUTION_LIMIT_REACHED',
  LOGIC_FUNCTION_CREATE_FAILED = 'LOGIC_FUNCTION_CREATE_FAILED',
  LOGIC_FUNCTION_COMPILATION_FAILED = 'LOGIC_FUNCTION_COMPILATION_FAILED',
  LOGIC_FUNCTION_EXECUTION_TIMEOUT = 'LOGIC_FUNCTION_EXECUTION_TIMEOUT',
  LOGIC_FUNCTION_EXECUTION_FAILED = 'LOGIC_FUNCTION_EXECUTION_FAILED',
  LOGIC_FUNCTION_LAYER_BUILD_FAILED = 'LOGIC_FUNCTION_LAYER_BUILD_FAILED',
  LOGIC_FUNCTION_DISABLED = 'LOGIC_FUNCTION_DISABLED',
  LOGIC_FUNCTION_INVALID_SEED_PROJECT = 'LOGIC_FUNCTION_INVALID_SEED_PROJECT',
}

const getLogicFunctionExceptionUserFriendlyMessage = (
  code: LogicFunctionExceptionCode,
) => {
  switch (code) {
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_NOT_FOUND:
      return msg`Fungsi tidak ditemukan.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_ALREADY_EXIST:
      return msg`Fungsi dengan nama ini sudah ada.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_NOT_READY:
      return msg`Fungsi belum siap.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_BUILDING:
      return msg`Fungsi sedang dibangun.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_CODE_UNCHANGED:
      return msg`Kode fungsi tidak berubah.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_EXECUTION_LIMIT_REACHED:
      return msg`Batas eksekusi fungsi tercapai.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_CREATE_FAILED:
      return msg`Gagal membuat fungsi.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_COMPILATION_FAILED:
      return msg`Kode fungsi gagal dikompilasi.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_EXECUTION_TIMEOUT:
      return msg`Eksekusi fungsi melebihi waktu.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_EXECUTION_FAILED:
      return msg`Eksekusi fungsi gagal.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_LAYER_BUILD_FAILED:
      return msg`Gagal membangun dependensi fungsi.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_DISABLED:
      return msg`Eksekusi fungsi logika dinonaktifkan.`;
    case LogicFunctionExceptionCode.LOGIC_FUNCTION_INVALID_SEED_PROJECT:
      return msg`Konfigurasi proyek seed tidak valid.`;
    default:
      assertUnreachable(code);
  }
};

export class LogicFunctionException extends CustomException<LogicFunctionExceptionCode> {
  constructor(
    message: string,
    code: LogicFunctionExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getLogicFunctionExceptionUserFriendlyMessage(code),
    });
  }
}
