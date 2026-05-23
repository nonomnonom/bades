import { type SettingsRolePermissionsSettingPermission } from '@/settings/roles/role-permissions/permission-flags/types/SettingsRolePermissionsSettingPermission';
import { t } from '~/utils/i18n/badesI18n';
import { useMemo } from 'react';
import {
  IconApps,
  IconCreditCard,
  IconHierarchy,
  IconKey,
  IconLayoutSidebarRightCollapse,
  IconLockOpen,
  IconSettings,
  IconSettingsAutomation,
  IconShield,
  IconSparkles,
  IconSpy,
  IconUsers,
} from 'ui/display';
import { PermissionFlagType } from '~/generated-metadata/graphql';

type UseSettingsRolePermissionFlagConfigParams = {
  assignmentCapabilities?: {
    canBeAssignedToAgents?: boolean;
    canBeAssignedToUsers?: boolean;
    canBeAssignedToApiKeys?: boolean;
  };
};

export const useSettingsRolePermissionFlagConfig = ({
  assignmentCapabilities,
}: UseSettingsRolePermissionFlagConfigParams = {}): SettingsRolePermissionsSettingPermission[] => {
  const {
    canBeAssignedToAgents = false,
    canBeAssignedToUsers = false,
    canBeAssignedToApiKeys = false,
  } = assignmentCapabilities ?? {};

  const hasAssignmentCapabilities = assignmentCapabilities !== undefined;

  return useMemo(() => {
    // Surface API key & webhook untuk perangkat desa sudah dihapus, jadi opsi
    // toggle-nya tidak ditampilkan di UI role permission. Flag tetap ada di
    // backend untuk kebutuhan internal tim Bades.
    const allPermissions: SettingsRolePermissionsSettingPermission[] = [
      {
        key: PermissionFlagType.WORKSPACE,
        name: t`Ruang Kerja`,
        description: t`Atur preferensi ruang kerja global`,
        Icon: IconSettings,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.WORKSPACE_MEMBERS,
        name: t`Pengguna`,
        description: t`Tambah atau hapus pengguna`,
        Icon: IconUsers,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.ROLES,
        name: t`Peran`,
        description: t`Tentukan peran dan tingkat akses pengguna`,
        Icon: IconLockOpen,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.DATA_MODEL,
        name: t`Model Data`,
        description: t`Ubah struktur data dan kolom`,
        Icon: IconHierarchy,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.SECURITY,
        name: t`Keamanan`,
        description: t`Kelola kebijakan keamanan`,
        Icon: IconKey,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.WORKFLOWS,
        name: t`Alur Kerja`,
        description: t`Kelola alur kerja`,
        Icon: IconSettingsAutomation,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.SSO_BYPASS,
        name: t`Lewati SSO`,
        description: t`Aktifkan opsi bypass SSO`,
        Icon: IconShield,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.IMPERSONATE,
        name: t`Representasi Pengguna`,
        description: t`Bertindak sebagai pengguna ruang kerja lain`,
        Icon: IconSpy,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.APPLICATIONS,
        name: t`Aplikasi`,
        description: t`Pasang dan kelola aplikasi`,
        Icon: IconApps,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.LAYOUTS,
        name: t`Tata Letak`,
        description: t`Sesuaikan tata letak halaman dan struktur antarmuka`,
        Icon: IconLayoutSidebarRightCollapse,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.BILLING,
        name: t`Tagihan`,
        description: t`Kelola tagihan dan langganan`,
        Icon: IconCreditCard,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.AI_SETTINGS,
        name: t`AI`,
        description: t`Buat dan konfigurasi agen AI`,
        Icon: IconSparkles,
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
