import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export class ViewSortException extends CustomException<ViewSortExceptionCode> {
  constructor(
    message: string,
    code: ViewSortExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? msg`Terjadi kesalahan pengurutan tampilan.`,
    });
  }
}

export enum ViewSortExceptionCode {
  VIEW_SORT_NOT_FOUND = 'VIEW_SORT_NOT_FOUND',
  INVALID_VIEW_SORT_DATA = 'INVALID_VIEW_SORT_DATA',
  VIEW_NOT_FOUND = 'VIEW_NOT_FOUND',
}

export enum ViewSortExceptionMessageKey {
  WORKSPACE_ID_REQUIRED = 'WORKSPACE_ID_REQUIRED',
  VIEW_ID_REQUIRED = 'VIEW_ID_REQUIRED',
  VIEW_SORT_NOT_FOUND = 'VIEW_SORT_NOT_FOUND',
  INVALID_VIEW_SORT_DATA = 'INVALID_VIEW_SORT_DATA',
  FIELD_METADATA_ID_REQUIRED = 'FIELD_METADATA_ID_REQUIRED',
  VIEW_NOT_FOUND = 'VIEW_NOT_FOUND',
}

export const generateViewSortExceptionMessage = (
  key: ViewSortExceptionMessageKey,
  id?: string,
) => {
  switch (key) {
    case ViewSortExceptionMessageKey.WORKSPACE_ID_REQUIRED:
      return 'WorkspaceId diperlukan';
    case ViewSortExceptionMessageKey.VIEW_ID_REQUIRED:
      return 'ViewId diperlukan';
    case ViewSortExceptionMessageKey.VIEW_SORT_NOT_FOUND:
      return `Pengurutan tampilan${id ? ` (id: ${id})` : ''} tidak ditemukan`;
    case ViewSortExceptionMessageKey.INVALID_VIEW_SORT_DATA:
      return `Data pengurutan tampilan tidak valid${id ? ` untuk id pengurutan tampilan: ${id}` : ''}`;
    case ViewSortExceptionMessageKey.FIELD_METADATA_ID_REQUIRED:
      return 'FieldMetadataId diperlukan';
    case ViewSortExceptionMessageKey.VIEW_NOT_FOUND:
      return `Tampilan${id ? ` (id: ${id})` : ''} tidak ditemukan`;
    default:
      assertUnreachable(key);
  }
};

export const generateViewSortUserFriendlyExceptionMessage = (
  key: ViewSortExceptionMessageKey,
): MessageDescriptor | undefined => {
  switch (key) {
    case ViewSortExceptionMessageKey.WORKSPACE_ID_REQUIRED:
      return msg`WorkspaceId diperlukan untuk membuat pengurutan tampilan.`;
    case ViewSortExceptionMessageKey.VIEW_ID_REQUIRED:
      return msg`ViewId diperlukan untuk membuat pengurutan tampilan.`;
    case ViewSortExceptionMessageKey.FIELD_METADATA_ID_REQUIRED:
      return msg`FieldMetadataId diperlukan untuk membuat pengurutan tampilan.`;
  }
};
