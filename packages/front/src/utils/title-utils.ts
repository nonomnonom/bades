import { t } from '~/utils/i18n/badesI18n';
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
      return t`Verifikasi`;
    case AppPath.SignInUp:
      return t`Masuk atau Buat Akun`;
    case AppPath.Invite:
      return t`Undangan`;
    case AppPath.CreateWorkspace:
      return t`Buat Ruang Kerja`;
    case AppPath.CreateProfile:
      return t`Buat Profil`;
    case SettingsPathPrefixes.Experience:
      return t`Tampilan - Pengaturan`;
    case SettingsPathPrefixes.Accounts:
      return t`Akun - Pengaturan`;
    case SettingsPathPrefixes.Profile:
      return t`Profil - Pengaturan`;
    case SettingsPathPrefixes.Members:
      return t`Anggota - Pengaturan`;
    case SettingsPathPrefixes.Objects:
      return t`Model Data - Pengaturan`;
    case SettingsPathPrefixes.ApiWebhooks:
      return t`Kunci API - Pengaturan`;
    case SettingsPathPrefixes.LogicFunctions:
      return t`Fungsi - Pengaturan`;
    case SettingsPathPrefixes.Integration:
      return t`Integrasi - Pengaturan`;
    case SettingsPathPrefixes.General:
      return t`Umum - Pengaturan`;
    default:
      return 'Bades.id';
  }
};
