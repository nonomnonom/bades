import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum FileStorageExceptionCode {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  ACCESS_DENIED = 'ACCESS_DENIED',
  INVALID_EXTENSION = 'INVALID_EXTENSION',
}

const getFileStorageExceptionUserFriendlyMessage = (
  code: FileStorageExceptionCode,
) => {
  switch (code) {
    case FileStorageExceptionCode.INVALID_EXTENSION:
      return msg`Ekstensi file salah.`;
    case FileStorageExceptionCode.FILE_NOT_FOUND:
      return msg`File tidak ditemukan.`;
    case FileStorageExceptionCode.ACCESS_DENIED:
      return msg`Akses ditolak.`;
    default:
      assertUnreachable(code);
  }
};

export class FileStorageException extends CustomException<FileStorageExceptionCode> {
  constructor(
    message: string,
    code: FileStorageExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getFileStorageExceptionUserFriendlyMessage(code),
    });
  }
}
