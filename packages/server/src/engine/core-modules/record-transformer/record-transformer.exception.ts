import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum RecordTransformerExceptionCode {
  INVALID_URL = 'INVALID_URL',
  INVALID_PHONE_NUMBER = 'INVALID_PHONE_NUMBER',
  INVALID_PHONE_COUNTRY_CODE = 'INVALID_PHONE_COUNTRY_CODE',
  INVALID_PHONE_CALLING_CODE = 'INVALID_PHONE_CALLING_CODE',
  CONFLICTING_PHONE_COUNTRY_CODE = 'CONFLICTING_PHONE_COUNTRY_CODE',
  CONFLICTING_PHONE_CALLING_CODE = 'CONFLICTING_PHONE_CALLING_CODE',
  CONFLICTING_PHONE_CALLING_CODE_AND_COUNTRY_CODE = 'CONFLICTING_PHONE_CALLING_CODE_AND_COUNTRY_CODE',
}

const getRecordTransformerExceptionUserFriendlyMessage = (
  code: RecordTransformerExceptionCode,
) => {
  switch (code) {
    case RecordTransformerExceptionCode.INVALID_URL:
      return msg`Format URL tidak valid.`;
    case RecordTransformerExceptionCode.INVALID_PHONE_NUMBER:
      return msg`Nomor telepon tidak valid.`;
    case RecordTransformerExceptionCode.INVALID_PHONE_COUNTRY_CODE:
      return msg`Kode negara telepon tidak valid.`;
    case RecordTransformerExceptionCode.INVALID_PHONE_CALLING_CODE:
      return msg`Kode panggil telepon tidak valid.`;
    case RecordTransformerExceptionCode.CONFLICTING_PHONE_COUNTRY_CODE:
      return msg`Kode negara telepon bertentangan.`;
    case RecordTransformerExceptionCode.CONFLICTING_PHONE_CALLING_CODE:
      return msg`Kode panggil telepon bertentangan.`;
    case RecordTransformerExceptionCode.CONFLICTING_PHONE_CALLING_CODE_AND_COUNTRY_CODE:
      return msg`Kode panggil dan kode negara telepon bertentangan.`;
    default:
      assertUnreachable(code);
  }
};

export class RecordTransformerException extends CustomException<RecordTransformerExceptionCode> {
  constructor(
    message: string,
    code: RecordTransformerExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getRecordTransformerExceptionUserFriendlyMessage(code),
    });
  }
}
