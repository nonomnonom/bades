import { type SettingsRolePermissionsSettingPermission } from '@/settings/roles/role-permissions/permission-flags/types/SettingsRolePermissionsSettingPermission';
import { t } from '@lingui/core/macro';
import { useMemo } from 'react';
import {
  IconApps,
  IconCode,
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
    const allPermissions: SettingsRolePermissionsSettingPermission[] = [
      {
        key: PermissionFlagType.API_KEYS_AND_WEBHOOKS,
        name: ""API Keys & Webhooks",
        description: ""Manage API keys and webhooks",
        Icon: IconCode,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.WORKSPACE,
        name: "Ruang kerja",
        description: ""Set global workspace preferences",
        Icon: IconSettings,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.WORKSPACE_MEMBERS,
        name: "Pengguna-pengguna",
        description: ""Add or remove users",
        Icon: IconUsers,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.ROLES,
        name: "Peran-peran",
        description: ""Define user roles and access levels",
        Icon: IconLockOpen,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.DATA_MODEL,
        name: ""Data Model",
        description: ""Edit data structure and fields",
        Icon: IconHierarchy,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.SECURITY,
        name: "Keamanan",
        description: ""Manage security policies",
        Icon: IconKey,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.WORKFLOWS,
        name: "Alur kerja-alur kerja",
        description: ""Manage workflows",
        Icon: IconSettingsAutomation,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.SSO_BYPASS,
        name: ""SSO Bypass",
        description: ""Enable bypass options",
        Icon: IconShield,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.IMPERSONATE,
        name: ""Impersonate",
        description: ""Impersonate workspace users",
        Icon: IconSpy,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.APPLICATIONS,
        name: ""Applications",
        description: ""Install and manage applications",
        Icon: IconApps,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.LAYOUTS,
        name: ""Layouts",
        description: ""Customize page layouts and UI structure",
        Icon: IconLayoutSidebarRightCollapse,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.BILLING,
        name: "Penagihan",
        description: ""Manage billing and subscriptions",
        Icon: IconCreditCard,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.AI_SETTINGS,
        name: ""AI",
        description: ""Create and configure AI agents",
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
