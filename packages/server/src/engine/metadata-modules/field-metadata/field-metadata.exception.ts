import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { STANDARD_ERROR_MESSAGE } from 'src/engine/api/common/common-query-runners/errors/standard-error-message.constant';
import {
  appendCommonExceptionCode,
  CustomException,
} from 'src/utils/custom-exception';

export const FieldMetadataExceptionCode = appendCommonExceptionCode({
  FIELD_METADATA_NOT_FOUND: 'FIELD_METADATA_NOT_FOUND',
  INVALID_FIELD_INPUT: 'INVALID_FIELD_INPUT',
  FIELD_MUTATION_NOT_ALLOWED: 'FIELD_MUTATION_NOT_ALLOWED',
  FIELD_ALREADY_EXISTS: 'FIELD_ALREADY_EXISTS',
  OBJECT_METADATA_NOT_FOUND: 'OBJECT_METADATA_NOT_FOUND',
  APPLICATION_NOT_FOUND: 'APPLICATION_NOT_FOUND',
  FIELD_METADATA_RELATION_NOT_ENABLED: 'FIELD_METADATA_RELATION_NOT_ENABLED',
  FIELD_METADATA_RELATION_MALFORMED: 'FIELD_METADATA_RELATION_MALFORMED',
  LABEL_IDENTIFIER_FIELD_METADATA_ID_NOT_FOUND:
    'LABEL_IDENTIFIER_FIELD_METADATA_ID_NOT_FOUND',
  UNCOVERED_FIELD_METADATA_TYPE_VALIDATION:
    'UNCOVERED_FIELD_METADATA_TYPE_VALIDATION',
  RESERVED_KEYWORD: 'RESERVED_KEYWORD',
  NOT_AVAILABLE: 'NOT_AVAILABLE',
  NAME_NOT_SYNCED_WITH_LABEL: 'NAME_NOT_SYNCED_WITH_LABEL',
} as const);

// oxlint-disable-next-line no-redeclare
export type FieldMetadataExceptionCode =
  (typeof FieldMetadataExceptionCode)[keyof typeof FieldMetadataExceptionCode];

const getFieldMetadataExceptionUserFriendlyMessage = (
  code: keyof typeof FieldMetadataExceptionCode,
) => {
  switch (code) {
    case FieldMetadataExceptionCode.FIELD_METADATA_NOT_FOUND:
      return msg`Kolom tidak ditemukan.`;
    case FieldMetadataExceptionCode.INVALID_FIELD_INPUT:
      return msg`Input kolom tidak valid.`;
    case FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED:
      return msg`Kolom ini tidak dapat diubah.`;
    case FieldMetadataExceptionCode.FIELD_ALREADY_EXISTS:
      return msg`Kolom dengan nama ini sudah ada.`;
    case FieldMetadataExceptionCode.OBJECT_METADATA_NOT_FOUND:
      return msg`Objek tidak ditemukan.`;
    case FieldMetadataExceptionCode.APPLICATION_NOT_FOUND:
      return msg`Aplikasi tidak ditemukan.`;
    case FieldMetadataExceptionCode.FIELD_METADATA_RELATION_NOT_ENABLED:
      return msg`Relasi tidak diaktifkan untuk kolom ini.`;
    case FieldMetadataExceptionCode.FIELD_METADATA_RELATION_MALFORMED:
      return msg`Konfigurasi relasi tidak valid.`;
    case FieldMetadataExceptionCode.LABEL_IDENTIFIER_FIELD_METADATA_ID_NOT_FOUND:
      return msg`Kolom label identifier tidak ditemukan.`;
    case FieldMetadataExceptionCode.UNCOVERED_FIELD_METADATA_TYPE_VALIDATION:
      return msg`Validasi tipe kolom bermasalah.`;
    case FieldMetadataExceptionCode.RESERVED_KEYWORD:
      return msg`Nama ini adalah kata kunci yang dilindungi.`;
    case FieldMetadataExceptionCode.NOT_AVAILABLE:
      return msg`Nama kolom ini tidak tersedia.`;
    case FieldMetadataExceptionCode.NAME_NOT_SYNCED_WITH_LABEL:
      return msg`Nama kolom tidak sinkron dengan label.`;
    case FieldMetadataExceptionCode.INTERNAL_SERVER_ERROR:
      return STANDARD_ERROR_MESSAGE;
    default:
      assertUnreachable(code);
  }
};

export class FieldMetadataException extends CustomException<
  keyof typeof FieldMetadataExceptionCode
> {
  constructor(
    message: string,
    code: keyof typeof FieldMetadataExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getFieldMetadataExceptionUserFriendlyMessage(code),
    });
  }
}
