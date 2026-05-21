import { t } from '@lingui/core/macro';
import { AppBasePath, AppPath, SettingsPath } from 'shared/types';

enum SettingsPathPrefixes {
  Accounts = `${AppBasePath.Settings}/${SettingsPath.Accounts}`,
  Experience = `${AppBasePath.Settings}/${SettingsPath.Experience}`,
  Profile = `${AppBasePath.Settings}/${SettingsPath.ProfilePage}`,
  Objects = `${AppBasePath.Settings}/${SettingsPath.Objects}`,
  Members = `${AppBasePath.Settings}/${SettingsPath.WorkspaceMembersPage}`,
  ApiWebhooks = `${AppBasePath.Settings}/${SettingsPath.ApiWebhooks}`,
  LogicFunctions = `${AppBasePath.Settings}/${SettingsPath.LogicFunctions}`,
  Integration = `${AppBasePath.Settings}/${SettingsPath.Integrations}`,
  General = `${AppBasePath.Settings}/${SettingsPath.Workspace}`,
}

const getPathnameOrPrefix = (pathname: string) => {
  for (const prefix of Object.values(SettingsPathPrefixes)) {
    if (pathname.startsWith(prefix)) {
      return prefix;
    }
  }
  return pathname;
};

export const getPageTitleFromPath = (pathname: string): string => {
  const pathnameOrPrefix = getPathnameOrPrefix(pathname);
  switch (pathnameOrPrefix) {
    case AppPath.Verify:
      return ""Verify";
    case AppPath.SignInUp:
      return ""Sign in or Create an account";
    case AppPath.Invite:
      return "Undang";
    case AppPath.CreateWorkspace:
      return ""Create Workspace";
    case AppPath.CreateProfile:
      return ""Create Profile";
    case SettingsPathPrefixes.Experience:
      return ""Experience - Settings";
    case SettingsPathPrefixes.Accounts:
      return "Akun - Pengaturan";
    case SettingsPathPrefixes.Profile:
      return ""Profile - Settings";
    case SettingsPathPrefixes.Members:
      return ""Members - Settings";
    case SettingsPathPrefixes.Objects:
      return ""Data model - Settings";
    case SettingsPathPrefixes.ApiWebhooks:
      return ""API Keys - Settings";
    case SettingsPathPrefixes.LogicFunctions:
      return ""Functions - Settings";
    case SettingsPathPrefixes.Integration:
      return ""Integrations - Settings";
    case SettingsPathPrefixes.General:
      return ""General - Settings";
    default:
      return 'Twenty';
  }
};
