import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export class ViewGroupException extends CustomException<ViewGroupExceptionCode> {
  constructor(
    message: string,
    code: ViewGroupExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? msg`Terjadi kesalahan pengelompokan tampilan.`,
    });
  }
}

export enum ViewGroupExceptionCode {
  VIEW_GROUP_NOT_FOUND = 'VIEW_GROUP_NOT_FOUND',
  INVALID_VIEW_GROUP_DATA = 'INVALID_VIEW_GROUP_DATA',
  VIEW_NOT_FOUND = 'VIEW_NOT_FOUND',
  MISSING_MAIN_GROUP_BY_FIELD_METADATA_ID = 'MISSING_MAIN_GROUP_BY_FIELD_METADATA_ID',
}

export enum ViewGroupExceptionMessageKey {
  WORKSPACE_ID_REQUIRED = 'WORKSPACE_ID_REQUIRED',
  VIEW_ID_REQUIRED = 'VIEW_ID_REQUIRED',
  VIEW_GROUP_NOT_FOUND = 'VIEW_GROUP_NOT_FOUND',
  INVALID_VIEW_GROUP_DATA = 'INVALID_VIEW_GROUP_DATA',
  FIELD_METADATA_ID_REQUIRED = 'FIELD_METADATA_ID_REQUIRED',
  VIEW_NOT_FOUND = 'VIEW_NOT_FOUND',
}

export const generateViewGroupExceptionMessage = (
  key: ViewGroupExceptionMessageKey,
  id?: string,
) => {
  switch (key) {
    case ViewGroupExceptionMessageKey.WORKSPACE_ID_REQUIRED:
      return 'WorkspaceId diperlukan';
    case ViewGroupExceptionMessageKey.VIEW_ID_REQUIRED:
      return 'ViewId diperlukan';
    case ViewGroupExceptionMessageKey.VIEW_GROUP_NOT_FOUND:
      return `Pengelompokan tampilan${id ? ` (id: ${id})` : ''} tidak ditemukan`;
    case ViewGroupExceptionMessageKey.INVALID_VIEW_GROUP_DATA:
      return `Data pengelompokan tampilan tidak valid${id ? ` untuk id pengelompokan tampilan: ${id}` : ''}`;
    case ViewGroupExceptionMessageKey.FIELD_METADATA_ID_REQUIRED:
      return 'FieldMetadataId diperlukan';
    case ViewGroupExceptionMessageKey.VIEW_NOT_FOUND:
      return `Tampilan${id ? ` (id: ${id})` : ''} tidak ditemukan`;
    default:
      assertUnreachable(key);
  }
};

export const generateViewGroupUserFriendlyExceptionMessage = (
  key: ViewGroupExceptionMessageKey,
): MessageDescriptor | undefined => {
  switch (key) {
    case ViewGroupExceptionMessageKey.WORKSPACE_ID_REQUIRED:
      return msg`WorkspaceId diperlukan untuk membuat pengelompokan tampilan.`;
    case ViewGroupExceptionMessageKey.VIEW_ID_REQUIRED:
      return msg`ViewId diperlukan untuk membuat pengelompokan tampilan.`;
    case ViewGroupExceptionMessageKey.FIELD_METADATA_ID_REQUIRED:
      return msg`FieldMetadataId diperlukan untuk membuat pengelompokan tampilan.`;
  }
};
