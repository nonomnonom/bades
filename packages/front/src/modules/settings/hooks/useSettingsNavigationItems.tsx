import { SettingsPath } from 'shared/types';

import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import { billingState } from '@/client-config/states/billingState';
import { supportChatState } from '@/client-config/states/supportChatState';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import {
  type NavigationDrawerItemIndentationLevel,
  type NavigationDrawerItemModifier,
} from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isNonEmptyString } from '@sniptt/guards';
import {
  IconAt,
  IconCalendarEvent,
  IconColorSwatch,
  type IconComponent,
  IconCurrencyDollar,
  IconDoorEnter,
  IconHierarchy2,
  IconKey,
  IconMail,
  IconMessage,
  IconPlug,
  IconRocket,
  IconServer,
  IconSettings,
  IconSparkles,
  IconUserCircle,
  IconUsers,
} from 'ui/display';
import { PermissionFlagType } from '~/generated-metadata/graphql';

export type SettingsNavigationSection = {
  label: string;
  items: SettingsNavigationItem[];
  isAdvanced?: boolean;
};

export type SettingsNavigationItem = {
  label: string;
  path?: SettingsPath;
  onClick?: () => void;
  Icon: IconComponent;
  indentationLevel?: NavigationDrawerItemIndentationLevel;
  matchSubPages?: boolean;
  isHidden?: boolean;
  subItems?: SettingsNavigationItem[];
  isAdvanced?: boolean;
  modifier?: NavigationDrawerItemModifier;
};

const useSettingsNavigationItems = (): SettingsNavigationSection[] => {
  const billing = useAtomStateValue(billingState);
  const { signOut } = useAuth();
  const supportChat = useAtomStateValue(supportChatState);

  const isBillingEnabled = billing?.isBillingEnabled ?? false;
  const currentUser = useAtomStateValue(currentUserState);
  const isAdminEnabled =
    (currentUser?.canImpersonate || currentUser?.canAccessFullAdminPanel) ??
    false;
  const isSupportChatConfigured =
    supportChat?.supportDriver === 'FRONT' &&
    isNonEmptyString(supportChat.supportFrontChatId);

  const permissionMap = usePermissionFlagMap();
  return [
    {
      label: `Pengguna`,
      items: [
        {
          label: `Profil`,
          path: SettingsPath.ProfilePage,
          Icon: IconUserCircle,
        },
        {
          label: `Tampilan`,
          path: SettingsPath.Experience,
          Icon: IconColorSwatch,
        },
        {
          label: `Akun`,
          path: SettingsPath.Accounts,
          Icon: IconAt,
          isHidden: !permissionMap[PermissionFlagType.CONNECTED_ACCOUNTS],
          subItems: [
            {
              label: `Surel`,
              path: SettingsPath.AccountsEmails,
              Icon: IconMail,
              isHidden: !permissionMap[PermissionFlagType.CONNECTED_ACCOUNTS],
              indentationLevel: 2,
            },
            {
              label: `Kalender`,
              path: SettingsPath.AccountsCalendars,
              Icon: IconCalendarEvent,
              isHidden: !permissionMap[PermissionFlagType.CONNECTED_ACCOUNTS],
              indentationLevel: 2,
            },
          ],
        },
      ],
    },
    {
      label: `Ruang Kerja`,
      items: [
        {
          label: `Umum`,
          path: SettingsPath.Workspace,
          Icon: IconSettings,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          // Model Data adalah fungsi inti Bades: setiap desa perlu
          // menyesuaikan struktur data warganya (tambah field penduduk,
          // jenis surat, kategori bantuan, dll). Bukan fitur lanjutan,
          // tampilkan di nav utama.
          label: `Model Data`,
          path: SettingsPath.Objects,
          Icon: IconHierarchy2,
          isHidden: !permissionMap[PermissionFlagType.DATA_MODEL],
        },
        {
          label: `Anggota`,
          path: SettingsPath.WorkspaceMembersPage,
          Icon: IconUsers,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE_MEMBERS],
        },
        {
          label: `Tagihan`,
          path: SettingsPath.Billing,
          Icon: IconCurrencyDollar,
          isHidden:
            !isBillingEnabled || !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          // Integrasi API/webhook bukan workflow administrasi desa, melainkan
          // kapabilitas internal tim Bades. Tetap disembunyikan dari navigasi
          // pengguna utama sampai arah integrasi desa-spesifik disiapkan.
          // Sistem aplikasi (Apps) juga diposisikan sebagai kapabilitas internal
          // tim Bades, bukan self-service untuk perangkat desa.
          label: `Aplikasi`,
          path: SettingsPath.Applications,
          Icon: IconPlug,
          isHidden: true,
          modifier: 'new',
        },
        {
          // Konfigurasi AI (agent, skill, tool, prompt, MCP) adalah
          // kapabilitas operasional tim Bades, bukan fitur perangkat desa.
          // Disembunyikan dari navigasi pengguna utama, hanya tampil untuk
          // admin yang memiliki akses panel penuh.
          label: `AI`,
          path: SettingsPath.AI,
          Icon: IconSparkles,
          isHidden: !isAdminEnabled,
        },
        {
          label: `Keamanan`,
          path: SettingsPath.Security,
          Icon: IconKey,
          isAdvanced: true,
          isHidden: !isAdminEnabled,
        },
      ],
    },
    {
      label: `Lainnya`,
      items: [
        {
          label: `Panel Admin`,
          path: SettingsPath.AdminPanel,
          Icon: IconServer,
          isHidden: !isAdminEnabled,
        },
        {
          // Update/release center adalah workflow operasional tim Bades, bukan
          // bagian dari pengalaman pengguna balai desa pada layanan terkelola.
          label: `Pembaruan`,
          path: SettingsPath.Updates,
          Icon: IconRocket,
          isHidden: true,
        },
        {
          label: `Bantuan`,
          onClick: () => window.FrontChat?.('show'),
          Icon: IconMessage,
          isHidden: !isSupportChatConfigured,
        },
        {
          label: `Keluar`,
          onClick: signOut,
          Icon: IconDoorEnter,
          matchSubPages: false,
        },
      ],
    },
  ];
};

export { useSettingsNavigationItems };
