import { type SettingsRolePermissionsSettingPermission } from '@/settings/roles/role-permissions/permission-flags/types/SettingsRolePermissionsSettingPermission';
import { t } from '@lingui/core/macro';
import { useMemo } from 'react';
import {
  IconApi,
  IconAt,
  IconDownload,
  IconFileExport,
  IconFileImport,
  IconFileUpload,
  IconMail,
  IconSparkles,
  IconTable,
  IconUser,
} from 'ui/display';
import { PermissionFlagType } from '~/generated-metadata/graphql';

type UseActionRolePermissionFlagConfigParams = {
  assignmentCapabilities?: {
    canBeAssignedToAgents?: boolean;
    canBeAssignedToUsers?: boolean;
    canBeAssignedToApiKeys?: boolean;
  };
};

export const useActionRolePermissionFlagConfig = ({
  assignmentCapabilities,
}: UseActionRolePermissionFlagConfigParams = {}): SettingsRolePermissionsSettingPermission[] => {
  const {
    canBeAssignedToAgents = false,
    canBeAssignedToUsers = false,
    canBeAssignedToApiKeys = false,
  } = assignmentCapabilities ?? {};

  const hasAssignmentCapabilities = assignmentCapabilities !== undefined;

  return useMemo(() => {
    const allPermissions: SettingsRolePermissionsSettingPermission[] = [
      {
        key: PermissionFlagType.AI,
        name: t`Tanya AI`,
        description: t`Mengobrol dengan agen AI dan menggunakan fitur AI`,
        Icon: IconSparkles,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.UPLOAD_FILE,
        name: t`Unggah Berkas`,
        description: t`Izinkan mengunggah berkas dan lampiran`,
        Icon: IconFileUpload,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.DOWNLOAD_FILE,
        name: t`Unduh Berkas`,
        description: t`Izinkan mengunduh berkas dan lampiran`,
        Icon: IconDownload,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.SEND_EMAIL_TOOL,
        name: t`Kirim Surel`,
        description: t`Kirim surel melalui akun yang terhubung`,
        Icon: IconMail,
        isToolPermission: true,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.HTTP_REQUEST_TOOL,
        name: t`Permintaan HTTP`,
        description: t`Buat permintaan HTTP ke API eksternal`,
        Icon: IconApi,
        isToolPermission: true,
        isRelevantForAgents: true,
        isRelevantForApiKeys: false,
        isRelevantForUsers: false,
      },
      {
        key: PermissionFlagType.IMPORT_CSV,
        name: t`Impor CSV`,
        description: t`Izinkan mengimpor data dari berkas CSV`,
        Icon: IconFileImport,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.EXPORT_CSV,
        name: t`Ekspor CSV`,
        description: t`Izinkan mengekspor data ke berkas CSV`,
        Icon: IconFileExport,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.CONNECTED_ACCOUNTS,
        name: t`Sinkronkan Akun`,
        description: t`Sinkronkan akun surel dan kalender`,
        Icon: IconAt,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.PROFILE_INFORMATION,
        name: t`Ubah Profil`,
        description: t`Ubah informasi profil sendiri`,
        Icon: IconUser,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.VIEWS,
        name: t`Kelola Tampilan`,
        description: t`Buat, ubah, dan hapus tampilan ruang kerja`,
        Icon: IconTable,
        isToolPermission: true,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
    ];

    const canBeAssignedOnlyToAgents =
      canBeAssignedToAgents && !canBeAssignedToUsers && !canBeAssignedToApiKeys;

    const canBeAssignedOnlyToApiKeys =
      canBeAssignedToApiKeys && !canBeAssignedToUsers && !canBeAssignedToAgents;

    const canBeAssignedOnlyToUsers =
      canBeAssignedToUsers && !canBeAssignedToAgents && !canBeAssignedToApiKeys;

    return allPermissions.filter((permission) => {
      if (hasAssignmentCapabilities) {
        if (canBeAssignedOnlyToAgents && !permission.isRelevantForAgents) {
          return false;
        }

        if (canBeAssignedOnlyToApiKeys && !permission.isRelevantForApiKeys) {
          return false;
        }

        if (canBeAssignedOnlyToUsers && !permission.isRelevantForUsers) {
          return false;
        }
      }

      return true;
    });
  }, [
    hasAssignmentCapabilities,
    canBeAssignedToAgents,
    canBeAssignedToUsers,
    canBeAssignedToApiKeys,
  ]);
};
