import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum PermissionsExceptionCode {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ADMIN_ROLE_NOT_FOUND = 'ADMIN_ROLE_NOT_FOUND',
  USER_WORKSPACE_NOT_FOUND = 'USER_WORKSPACE_NOT_FOUND',
  WORKSPACE_ID_ROLE_USER_WORKSPACE_MISMATCH = 'WORKSPACE_ID_ROLE_USER_WORKSPACE_MISMATCH',
  TOO_MANY_ADMIN_CANDIDATES = 'TOO_MANY_ADMIN_CANDIDATES',
  USER_WORKSPACE_ALREADY_HAS_ROLE = 'USER_WORKSPACE_ALREADY_HAS_ROLE',
  WORKSPACE_MEMBER_NOT_FOUND = 'WORKSPACE_MEMBER_NOT_FOUND',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  CANNOT_UNASSIGN_LAST_ADMIN = 'CANNOT_UNASSIGN_LAST_ADMIN',
  CANNOT_DELETE_LAST_ADMIN_USER = 'CANNOT_DELETE_LAST_ADMIN_USER',
  UNKNOWN_OPERATION_NAME = 'UNKNOWN_OPERATION_NAME_PERMISSIONS',
  UNKNOWN_REQUIRED_PERMISSION = 'UNKNOWN_REQUIRED_PERMISSION',
  CANNOT_UPDATE_SELF_ROLE = 'CANNOT_UPDATE_SELF_ROLE',
  NO_ROLE_FOUND_FOR_USER_WORKSPACE = 'NO_ROLE_FOUND_FOR_USER_WORKSPACE',
  API_KEY_ROLE_NOT_FOUND = 'API_KEY_ROLE_NOT_FOUND',
  NO_AUTHENTICATION_CONTEXT = 'NO_AUTHENTICATION_CONTEXT',
  INVALID_ARG = 'INVALID_ARG_PERMISSIONS',
  ROLE_LABEL_ALREADY_EXISTS = 'ROLE_LABEL_ALREADY_EXISTS',
  DEFAULT_ROLE_NOT_FOUND = 'DEFAULT_ROLE_NOT_FOUND',
  OBJECT_METADATA_NOT_FOUND = 'OBJECT_METADATA_NOT_FOUND_PERMISSIONS',
  INVALID_SETTING = 'INVALID_SETTING_PERMISSIONS',
  ROLE_NOT_EDITABLE = 'ROLE_NOT_EDITABLE',
  DEFAULT_ROLE_CANNOT_BE_DELETED = 'DEFAULT_ROLE_CANNOT_BE_DELETED',
  NO_PERMISSIONS_FOUND_IN_DATASOURCE = 'NO_PERMISSIONS_FOUND_IN_DATASOURCE',
  CANNOT_ADD_OBJECT_PERMISSION_ON_SYSTEM_OBJECT = 'CANNOT_ADD_OBJECT_PERMISSION_ON_SYSTEM_OBJECT',
  CANNOT_ADD_FIELD_PERMISSION_ON_SYSTEM_OBJECT = 'CANNOT_ADD_FIELD_PERMISSION_ON_SYSTEM_OBJECT',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  RAW_SQL_NOT_ALLOWED = 'RAW_SQL_NOT_ALLOWED',
  CANNOT_GIVE_WRITING_PERMISSION_ON_NON_READABLE_OBJECT = 'CANNOT_GIVE_WRITING_PERMISSION_ON_NON_READABLE_OBJECT',
  CANNOT_GIVE_WRITING_PERMISSION_WITHOUT_READING_PERMISSION = 'CANNOT_GIVE_WRITING_PERMISSION_WITHOUT_READING_PERMISSION',
  FIELD_METADATA_NOT_FOUND = 'FIELD_METADATA_NOT_FOUND',
  ONLY_FIELD_RESTRICTION_ALLOWED = 'ONLY_FIELD_RESTRICTION_ALLOWED',
  FIELD_RESTRICTION_ONLY_ALLOWED_ON_READABLE_OBJECT = 'FIELD_RESTRICTION_ONLY_ALLOWED_ON_READABLE_OBJECT',
  FIELD_RESTRICTION_ON_UPDATE_ONLY_ALLOWED_ON_UPDATABLE_OBJECT = 'FIELD_RESTRICTION_ON_UPDATE_ONLY_ALLOWED_ON_UPDATABLE_OBJECT',
  UPSERT_FIELD_PERMISSION_FAILED = 'UPSERT_FIELD_PERMISSION_FAILED',
  PERMISSION_NOT_FOUND = 'PERMISSION_NOT_FOUND',
  OBJECT_PERMISSION_NOT_FOUND = 'OBJECT_PERMISSION_NOT_FOUND',
  FIELD_PERMISSION_NOT_FOUND = 'FIELD_PERMISSION_NOT_FOUND',
  EMPTY_FIELD_PERMISSION_NOT_ALLOWED = 'EMPTY_FIELD_PERMISSION_NOT_ALLOWED',
  JOIN_COLUMN_NAME_REQUIRED = 'JOIN_COLUMN_NAME_REQUIRED',
  COMPOSITE_TYPE_NOT_FOUND = 'COMPOSITE_TYPE_NOT_FOUND',
  ROLE_MUST_HAVE_AT_LEAST_ONE_TARGET = 'ROLE_MUST_HAVE_AT_LEAST_ONE_TARGET',
  ROLE_CANNOT_BE_ASSIGNED_TO_USERS = 'ROLE_CANNOT_BE_ASSIGNED_TO_USERS',
  APPLICATION_ROLE_NOT_FOUND = 'APPLICATION_ROLE_NOT_FOUND',
  ROLE_BELONGS_TO_ANOTHER_APPLICATION = 'ROLE_BELONGS_TO_ANOTHER_APPLICATION',
}

const getPermissionsExceptionUserFriendlyMessage = (
  code: PermissionsExceptionCode,
) => {
  switch (code) {
    case PermissionsExceptionCode.PERMISSION_DENIED:
      return msg`Anda tidak memiliki izin untuk melakukan tindakan ini.`;
    case PermissionsExceptionCode.ADMIN_ROLE_NOT_FOUND:
      return msg`Role admin tidak ditemukan.`;
    case PermissionsExceptionCode.USER_WORKSPACE_NOT_FOUND:
      return msg`Ruang kerja pengguna tidak ditemukan.`;
    case PermissionsExceptionCode.WORKSPACE_ID_ROLE_USER_WORKSPACE_MISMATCH:
      return msg`ID ruang kerja dan role tidak cocok.`;
    case PermissionsExceptionCode.TOO_MANY_ADMIN_CANDIDATES:
      return msg`Terlalu banyak kandidat admin ditemukan.`;
    case PermissionsExceptionCode.USER_WORKSPACE_ALREADY_HAS_ROLE:
      return msg`Pengguna sudah memiliki role yang ditetapkan.`;
    case PermissionsExceptionCode.WORKSPACE_MEMBER_NOT_FOUND:
      return msg`Anggota ruang kerja tidak ditemukan.`;
    case PermissionsExceptionCode.ROLE_NOT_FOUND:
      return msg`Role tidak ditemukan.`;
    case PermissionsExceptionCode.CANNOT_UNASSIGN_LAST_ADMIN:
      return msg`Tidak dapat menghapus admin terakhir dari ruang kerja.`;
    case PermissionsExceptionCode.CANNOT_DELETE_LAST_ADMIN_USER:
      return msg`Tidak dapat menghapus pengguna admin terakhir.`;
    case PermissionsExceptionCode.UNKNOWN_OPERATION_NAME:
      return msg`Operasi tidak dikenal.`;
    case PermissionsExceptionCode.UNKNOWN_REQUIRED_PERMISSION:
      return msg`Izin yang diperlukan tidak dikenal.`;
    case PermissionsExceptionCode.CANNOT_UPDATE_SELF_ROLE:
      return msg`Anda tidak dapat memperbarui role Anda sendiri.`;
    case PermissionsExceptionCode.NO_ROLE_FOUND_FOR_USER_WORKSPACE:
      return msg`Tidak ada role untuk pengguna ini di ruang kerja.`;
    case PermissionsExceptionCode.API_KEY_ROLE_NOT_FOUND:
      return msg`Role kunci API tidak ditemukan.`;
    case PermissionsExceptionCode.NO_AUTHENTICATION_CONTEXT:
      return msg`Autentikasi diperlukan.`;
    case PermissionsExceptionCode.INVALID_ARG:
      return msg`Argumen tidak valid.`;
    case PermissionsExceptionCode.ROLE_LABEL_ALREADY_EXISTS:
      return msg`Role dengan label ini sudah ada.`;
    case PermissionsExceptionCode.DEFAULT_ROLE_NOT_FOUND:
      return msg`Role default tidak ditemukan.`;
    case PermissionsExceptionCode.OBJECT_METADATA_NOT_FOUND:
      return msg`Metadata objek tidak ditemukan.`;
    case PermissionsExceptionCode.INVALID_SETTING:
      return msg`Pengaturan izin tidak valid.`;
    case PermissionsExceptionCode.ROLE_NOT_EDITABLE:
      return msg`Role ini tidak dapat diedit.`;
    case PermissionsExceptionCode.DEFAULT_ROLE_CANNOT_BE_DELETED:
      return msg`Role default tidak dapat dihapus.`;
    case PermissionsExceptionCode.NO_PERMISSIONS_FOUND_IN_DATASOURCE:
      return msg`Tidak ada izin ditemukan di sumber data.`;
    case PermissionsExceptionCode.CANNOT_ADD_OBJECT_PERMISSION_ON_SYSTEM_OBJECT:
      return msg`Tidak dapat menambahkan izin pada objek sistem.`;
    case PermissionsExceptionCode.CANNOT_ADD_FIELD_PERMISSION_ON_SYSTEM_OBJECT:
      return msg`Tidak dapat menambahkan izin kolom pada objek sistem.`;
    case PermissionsExceptionCode.METHOD_NOT_ALLOWED:
      return msg`Metode ini tidak diizinkan.`;
    case PermissionsExceptionCode.RAW_SQL_NOT_ALLOWED:
      return msg`Kueri SQL langsung tidak diizinkan.`;
    case PermissionsExceptionCode.CANNOT_GIVE_WRITING_PERMISSION_ON_NON_READABLE_OBJECT:
      return msg`Tidak dapat memberikan izin tulis pada objek yang tidak dapat dibaca.`;
    case PermissionsExceptionCode.CANNOT_GIVE_WRITING_PERMISSION_WITHOUT_READING_PERMISSION:
      return msg`Tidak dapat memberikan izin tulis tanpa izin baca.`;
    case PermissionsExceptionCode.FIELD_METADATA_NOT_FOUND:
      return msg`Metadata kolom tidak ditemukan.`;
    case PermissionsExceptionCode.ONLY_FIELD_RESTRICTION_ALLOWED:
      return msg`Hanya pembatasan kolom yang diizinkan.`;
    case PermissionsExceptionCode.FIELD_RESTRICTION_ONLY_ALLOWED_ON_READABLE_OBJECT:
      return msg`Pembatasan kolom hanya berlaku pada objek yang dapat dibaca.`;
    case PermissionsExceptionCode.FIELD_RESTRICTION_ON_UPDATE_ONLY_ALLOWED_ON_UPDATABLE_OBJECT:
      return msg`Pembatasan kolom pada pembaruan hanya berlaku pada objek yang dapat diperbarui.`;
    case PermissionsExceptionCode.UPSERT_FIELD_PERMISSION_FAILED:
      return msg`Gagal memperbarui izin kolom.`;
    case PermissionsExceptionCode.PERMISSION_NOT_FOUND:
      return msg`Izin tidak ditemukan.`;
    case PermissionsExceptionCode.OBJECT_PERMISSION_NOT_FOUND:
      return msg`Izin objek tidak ditemukan.`;
    case PermissionsExceptionCode.FIELD_PERMISSION_NOT_FOUND:
      return msg`Izin kolom tidak ditemukan.`;
    case PermissionsExceptionCode.EMPTY_FIELD_PERMISSION_NOT_ALLOWED:
      return msg`Izin kolom kosong tidak diizinkan.`;
    case PermissionsExceptionCode.JOIN_COLUMN_NAME_REQUIRED:
      return msg`Nama kolom gabung diperlukan.`;
    case PermissionsExceptionCode.COMPOSITE_TYPE_NOT_FOUND:
      return msg`Tipe komposit tidak ditemukan.`;
    case PermissionsExceptionCode.ROLE_MUST_HAVE_AT_LEAST_ONE_TARGET:
      return msg`Role harus memiliki setidaknya satu target.`;
    case PermissionsExceptionCode.ROLE_CANNOT_BE_ASSIGNED_TO_USERS:
      return msg`Role ini tidak dapat ditetapkan ke pengguna.`;
    case PermissionsExceptionCode.APPLICATION_ROLE_NOT_FOUND:
      return msg`Tidak ada role yang ditetapkan ke aplikasi.`;
    case PermissionsExceptionCode.ROLE_BELONGS_TO_ANOTHER_APPLICATION:
      return msg`Tidak dapat menargetkan role yang dimiliki aplikasi lain.`;
    default:
      assertUnreachable(code);
  }
};

export class PermissionsException extends CustomException<PermissionsExceptionCode> {
  constructor(
    message: string,
    code: PermissionsExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getPermissionsExceptionUserFriendlyMessage(code),
    });
  }
}

export enum PermissionsExceptionMessage {
  PERMISSION_DENIED = 'Entity performing the request does not have permission',
  USER_WORKSPACE_NOT_FOUND = 'Ruang kerja pengguna tidak ditemukan',
  ROLE_NOT_FOUND = 'Role not found',
  CANNOT_UNASSIGN_LAST_ADMIN = 'Cannot unassign admin role from last admin of the workspace',
  CANNOT_DELETE_LAST_ADMIN_USER = 'Cannot delete account: user is the unique admin of a workspace',
  UNKNOWN_OPERATION_NAME = 'Unknown operation name, cannot determine required permission',
  CANNOT_UPDATE_SELF_ROLE = 'Cannot update self role',
  NO_ROLE_FOUND_FOR_USER_WORKSPACE = 'No role found for userWorkspace',
  API_KEY_ROLE_NOT_FOUND = 'API key has no role assigned',
  NO_AUTHENTICATION_CONTEXT = 'No valid authentication context found',
  ROLE_LABEL_ALREADY_EXISTS = 'A role with this label already exists',
  DEFAULT_ROLE_NOT_FOUND = 'Default role not found',
  OBJECT_METADATA_NOT_FOUND = 'Object metadata not found',
  INVALID_SETTING = 'Invalid permission setting (unknown value)',
  ROLE_NOT_EDITABLE = 'Role is not editable',
  DEFAULT_ROLE_CANNOT_BE_DELETED = 'Default role cannot be deleted',
  CANNOT_ADD_OBJECT_PERMISSION_ON_SYSTEM_OBJECT = 'Cannot add object permission on system object',
  CANNOT_ADD_FIELD_PERMISSION_ON_SYSTEM_OBJECT = 'Cannot add field permission on system object',
  CANNOT_GIVE_WRITING_PERMISSION_ON_NON_READABLE_OBJECT = 'Cannot give update permission to non-readable object',
  CANNOT_GIVE_WRITING_PERMISSION_WITHOUT_READING_PERMISSION = 'Cannot give writing permission without reading permission',
  FIELD_METADATA_NOT_FOUND = 'Field metadata not found',
  ONLY_FIELD_RESTRICTION_ALLOWED = 'Field permission can only introduce a restriction',
  FIELD_RESTRICTION_ONLY_ALLOWED_ON_READABLE_OBJECT = 'Field restriction only makes sense on readable object',
  FIELD_RESTRICTION_ON_UPDATE_ONLY_ALLOWED_ON_UPDATABLE_OBJECT = 'Field restriction on update only makes sense on updatable object',
  OBJECT_PERMISSION_NOT_FOUND = 'Object permission not found',
  FIELD_PERMISSION_NOT_FOUND = 'Field permission not found',
  EMPTY_FIELD_PERMISSION_NOT_ALLOWED = 'Empty field permission not allowed',
  ROLE_MUST_HAVE_AT_LEAST_ONE_TARGET = 'Role must be assignable to at least one target type',
  ROLE_CANNOT_BE_ASSIGNED_TO_USERS = 'Role cannot be assigned to users',
  APPLICATION_ROLE_NOT_FOUND = 'Application role not found',
}
