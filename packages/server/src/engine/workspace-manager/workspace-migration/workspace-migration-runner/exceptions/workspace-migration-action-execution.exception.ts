import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable, CustomError } from 'shared/utils';

export const WorkspaceMigrationActionExecutionExceptionCode = {
  FIELD_METADATA_NOT_FOUND: 'FIELD_METADATA_NOT_FOUND',
  OBJECT_METADATA_NOT_FOUND: 'OBJECT_METADATA_NOT_FOUND',
  ENUM_OPERATION_FAILED: 'ENUM_OPERATION_FAILED',
  UNSUPPORTED_COMPOSITE_COLUMN_TYPE: 'UNSUPPORTED_COMPOSITE_COLUMN_TYPE',
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  INVALID_ACTION_TYPE: 'INVALID_ACTION_TYPE',
  FLAT_ENTITY_NOT_FOUND: 'FLAT_ENTITY_NOT_FOUND',
  UNSUPPORTED_FIELD_METADATA_TYPE: 'UNSUPPORTED_FIELD_METADATA_TYPE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

const getWorkspaceMigrationActionExecutionExceptionUserFriendlyMessage = (
  code: keyof typeof WorkspaceMigrationActionExecutionExceptionCode,
) => {
  switch (code) {
    case WorkspaceMigrationActionExecutionExceptionCode.FIELD_METADATA_NOT_FOUND:
      return msg`Metadata kolom tidak ditemukan.`;
    case WorkspaceMigrationActionExecutionExceptionCode.OBJECT_METADATA_NOT_FOUND:
      return msg`Metadata objek tidak ditemukan.`;
    case WorkspaceMigrationActionExecutionExceptionCode.ENUM_OPERATION_FAILED:
      return msg`Operasi enum gagal.`;
    case WorkspaceMigrationActionExecutionExceptionCode.UNSUPPORTED_COMPOSITE_COLUMN_TYPE:
      return msg`Tipe kolom komposit tidak didukung.`;
    case WorkspaceMigrationActionExecutionExceptionCode.NOT_SUPPORTED:
      return msg`Operasi ini tidak didukung.`;
    case WorkspaceMigrationActionExecutionExceptionCode.INVALID_ACTION_TYPE:
      return msg`Tipe aksi tidak valid.`;
    case WorkspaceMigrationActionExecutionExceptionCode.FLAT_ENTITY_NOT_FOUND:
      return msg`Entitas tidak ditemukan.`;
    case WorkspaceMigrationActionExecutionExceptionCode.UNSUPPORTED_FIELD_METADATA_TYPE:
      return msg`Tipe metadata kolom tidak didukung.`;
    case WorkspaceMigrationActionExecutionExceptionCode.INTERNAL_SERVER_ERROR:
      return msg`Terjadi kesalahan yang tidak diharapkan.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkspaceMigrationActionExecutionException extends CustomError {
  code: keyof typeof WorkspaceMigrationActionExecutionExceptionCode;
  userFriendlyMessage: MessageDescriptor;

  constructor({
    message,
    code,
    userFriendlyMessage,
  }: {
    message: string;
    code: keyof typeof WorkspaceMigrationActionExecutionExceptionCode;
    userFriendlyMessage?: MessageDescriptor;
  }) {
    super(message);

    this.code = code;
    this.userFriendlyMessage =
      userFriendlyMessage ??
      getWorkspaceMigrationActionExecutionExceptionUserFriendlyMessage(code);
  }
}
