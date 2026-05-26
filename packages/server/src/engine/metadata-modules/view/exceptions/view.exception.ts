import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export class ViewException extends CustomException<ViewExceptionCode> {
  constructor(
    message: string,
    code: ViewExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? msg`Terjadi kesalahan tampilan.`,
    });
  }
}

export enum ViewExceptionCode {
  VIEW_NOT_FOUND = 'VIEW_NOT_FOUND',
  INVALID_VIEW_DATA = 'INVALID_VIEW_DATA',
  VIEW_CREATE_PERMISSION_DENIED = 'VIEW_CREATE_PERMISSION_DENIED',
  VIEW_MODIFY_PERMISSION_DENIED = 'VIEW_MODIFY_PERMISSION_DENIED',
  VIEW_WIDGET_NOT_FOUND = 'VIEW_WIDGET_NOT_FOUND',
}

export enum ViewExceptionMessageKey {
  WORKSPACE_ID_REQUIRED = 'WORKSPACE_ID_REQUIRED',
  OBJECT_METADATA_ID_REQUIRED = 'OBJECT_METADATA_ID_REQUIRED',
  VIEW_NOT_FOUND = 'VIEW_NOT_FOUND',
  INVALID_VIEW_DATA = 'INVALID_VIEW_DATA',
  VIEW_CREATE_PERMISSION_DENIED = 'VIEW_CREATE_PERMISSION_DENIED',
  VIEW_MODIFY_PERMISSION_DENIED = 'VIEW_MODIFY_PERMISSION_DENIED',
}

export const generateViewExceptionMessage = (
  key: ViewExceptionMessageKey,
  id?: string,
) => {
  switch (key) {
    case ViewExceptionMessageKey.WORKSPACE_ID_REQUIRED:
      return 'WorkspaceId diperlukan';
    case ViewExceptionMessageKey.OBJECT_METADATA_ID_REQUIRED:
      return 'ObjectMetadataId diperlukan';
    case ViewExceptionMessageKey.VIEW_NOT_FOUND:
      return `Tampilan${id ? ` (id: ${id})` : ''} tidak ditemukan`;
    case ViewExceptionMessageKey.INVALID_VIEW_DATA:
      return `Data tampilan tidak valid${id ? ` untuk id tampilan: ${id}` : ''}`;
    case ViewExceptionMessageKey.VIEW_CREATE_PERMISSION_DENIED:
      return 'Anda tidak memiliki izin untuk membuat tampilan level ruang kerja';
    case ViewExceptionMessageKey.VIEW_MODIFY_PERMISSION_DENIED:
      return 'Anda tidak memiliki izin untuk mengubah tampilan ini';
    default:
      assertUnreachable(key);
  }
};

export const generateViewUserFriendlyExceptionMessage = (
  key: ViewExceptionMessageKey,
): MessageDescriptor | undefined => {
  switch (key) {
    case ViewExceptionMessageKey.WORKSPACE_ID_REQUIRED:
      return msg`WorkspaceId diperlukan untuk membuat tampilan.`;
    case ViewExceptionMessageKey.OBJECT_METADATA_ID_REQUIRED:
      return msg`ObjectMetadataId diperlukan untuk membuat tampilan.`;
    case ViewExceptionMessageKey.VIEW_CREATE_PERMISSION_DENIED:
      return msg`Anda tidak memiliki izin untuk membuat tampilan level ruang kerja.`;
    case ViewExceptionMessageKey.VIEW_MODIFY_PERMISSION_DENIED:
      return msg`Anda tidak memiliki izin untuk mengubah tampilan ini.`;
  }
};
