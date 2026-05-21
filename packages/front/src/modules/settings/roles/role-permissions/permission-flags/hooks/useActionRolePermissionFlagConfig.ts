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
        name: ""Ask AI",
        description: ""Chat with AI agents and use AI features",
        Icon: IconSparkles,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.UPLOAD_FILE,
        name: ""Upload Files",
        description: ""Allow uploading files and attachments",
        Icon: IconFileUpload,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.DOWNLOAD_FILE,
        name: ""Download Files",
        description: ""Allow downloading files and attachments",
        Icon: IconDownload,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.SEND_EMAIL_TOOL,
        name: ""Send Email",
        description: ""Send emails via connected accounts",
        Icon: IconMail,
        isToolPermission: true,
        isRelevantForAgents: true,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.HTTP_REQUEST_TOOL,
        name: ""HTTP Request",
        description: ""Make HTTP requests to external APIs",
        Icon: IconApi,
        isToolPermission: true,
        isRelevantForAgents: true,
        isRelevantForApiKeys: false,
        isRelevantForUsers: false,
      },
      {
        key: PermissionFlagType.IMPORT_CSV,
        name: ""Import CSV",
        description: ""Allow importing data from CSV files",
        Icon: IconFileImport,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.EXPORT_CSV,
        name: ""Export CSV",
        description: ""Allow exporting data to CSV files",
        Icon: IconFileExport,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: true,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.CONNECTED_ACCOUNTS,
        name: ""Sync Account",
        description: ""Sync email and calendar accounts",
        Icon: IconAt,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.PROFILE_INFORMATION,
        name: ""Edit Profile",
        description: ""Edit own profile information",
        Icon: IconUser,
        isToolPermission: true,
        isRelevantForAgents: false,
        isRelevantForApiKeys: false,
        isRelevantForUsers: true,
      },
      {
        key: PermissionFlagType.VIEWS,
        name: ""Manage Views",
        description: ""Create, edit, and delete workspace views",
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
