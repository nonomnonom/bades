import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export class ViewFilterException extends CustomException<ViewFilterExceptionCode> {
  constructor(
    message: string,
    code: ViewFilterExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? msg`Terjadi kesalahan penyaringan tampilan.`,
    });
  }
}

export enum ViewFilterExceptionCode {
  VIEW_FILTER_NOT_FOUND = 'VIEW_FILTER_NOT_FOUND',
  INVALID_VIEW_FILTER_DATA = 'INVALID_VIEW_FILTER_DATA',
  VIEW_NOT_FOUND = 'VIEW_NOT_FOUND',
}

export enum ViewFilterExceptionMessageKey {
  WORKSPACE_ID_REQUIRED = 'WORKSPACE_ID_REQUIRED',
  VIEW_ID_REQUIRED = 'VIEW_ID_REQUIRED',
  VIEW_FILTER_NOT_FOUND = 'VIEW_FILTER_NOT_FOUND',
  INVALID_VIEW_FILTER_DATA = 'INVALID_VIEW_FILTER_DATA',
  FIELD_METADATA_ID_REQUIRED = 'FIELD_METADATA_ID_REQUIRED',
  VIEW_NOT_FOUND = 'VIEW_NOT_FOUND',
}

export const generateViewFilterExceptionMessage = (
  key: ViewFilterExceptionMessageKey,
  id?: string,
) => {
  switch (key) {
    case ViewFilterExceptionMessageKey.WORKSPACE_ID_REQUIRED:
      return 'WorkspaceId diperlukan';
    case ViewFilterExceptionMessageKey.VIEW_ID_REQUIRED:
      return 'ViewId diperlukan';
    case ViewFilterExceptionMessageKey.VIEW_FILTER_NOT_FOUND:
      return `Penyaringan tampilan${id ? ` (id: ${id})` : ''} tidak ditemukan`;
    case ViewFilterExceptionMessageKey.INVALID_VIEW_FILTER_DATA:
      return `Data penyaringan tampilan tidak valid${id ? ` untuk id penyaringan tampilan: ${id}` : ''}`;
    case ViewFilterExceptionMessageKey.FIELD_METADATA_ID_REQUIRED:
      return 'FieldMetadataId diperlukan';
    case ViewFilterExceptionMessageKey.VIEW_NOT_FOUND:
      return `Tampilan${id ? ` (id: ${id})` : ''} tidak ditemukan`;
    default:
      assertUnreachable(key);
  }
};

export const generateViewFilterUserFriendlyExceptionMessage = (
  key: ViewFilterExceptionMessageKey,
): MessageDescriptor | undefined => {
  switch (key) {
    case ViewFilterExceptionMessageKey.WORKSPACE_ID_REQUIRED:
      return msg`WorkspaceId diperlukan untuk membuat penyaringan tampilan.`;
    case ViewFilterExceptionMessageKey.VIEW_ID_REQUIRED:
      return msg`ViewId diperlukan untuk membuat penyaringan tampilan.`;
    case ViewFilterExceptionMessageKey.FIELD_METADATA_ID_REQUIRED:
      return msg`FieldMetadataId diperlukan untuk membuat penyaringan tampilan.`;
  }
};
