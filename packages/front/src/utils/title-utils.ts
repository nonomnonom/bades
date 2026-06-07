import { AppBasePath, AppPath, SettingsPath } from 'shared/types';

enum SettingsPathPrefixes {
  Accounts = `${AppBasePath.Settings}/${SettingsPath.Accounts}`,
  Experience = `${AppBasePath.Settings}/${SettingsPath.Experience}`,
  Profile = `${AppBasePath.Settings}/${SettingsPath.ProfilePage}`,
  Objects = `${AppBasePath.Settings}/${SettingsPath.Objects}`,
  Members = `${AppBasePath.Settings}/${SettingsPath.WorkspaceMembersPage}`,
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
      return `Verifikasi`;
    case AppPath.SignInUp:
      return `Masuk atau Buat Akun`;
    case AppPath.Invite:
      return `Undangan`;
    case AppPath.CreateWorkspace:
      return `Buat Ruang Kerja`;
    case AppPath.CreateProfile:
      return `Buat Profil`;
    case SettingsPathPrefixes.Experience:
      return `Tampilan - Pengaturan`;
    case SettingsPathPrefixes.Accounts:
      return `Akun - Pengaturan`;
    case SettingsPathPrefixes.Profile:
      return `Profil - Pengaturan`;
    case SettingsPathPrefixes.Members:
      return `Anggota - Pengaturan`;
    case SettingsPathPrefixes.Objects:
      return `Model Data - Pengaturan`;
    case SettingsPathPrefixes.LogicFunctions:
      return `Fungsi - Pengaturan`;
    case SettingsPathPrefixes.Integration:
      return `Integrasi - Pengaturan`;
    case SettingsPathPrefixes.General:
      return `Umum - Pengaturan`;
    default:
      return 'Bades.id';
  }
};
