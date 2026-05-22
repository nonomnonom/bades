import { SettingsPath } from 'shared/types';

import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { billingState } from '@/client-config/states/billingState';
import { supportChatState } from '@/client-config/states/supportChatState';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';
import {
  type NavigationDrawerItemIndentationLevel,
  type NavigationDrawerItemModifier,
} from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { t } from '@lingui/core/macro';
import { isNonEmptyString } from '@sniptt/guards';
import {
  IconApi,
  // IconApps, // TODO: Re-enable when integrations page is ready
  IconAt,
  IconCalendarEvent,
  IconColorSwatch,
  type IconComponent,
  IconCurrencyDollar,
  IconDoorEnter,
  IconHelpCircle,
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
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

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
      label: t`Pengguna`,
      items: [
        {
          label: t`Profil`,
          path: SettingsPath.ProfilePage,
          Icon: IconUserCircle,
        },
        {
          label: t`Tampilan`,
          path: SettingsPath.Experience,
          Icon: IconColorSwatch,
        },
        {
          label: t`Akun`,
          path: SettingsPath.Accounts,
          Icon: IconAt,
          isHidden: !permissionMap[PermissionFlagType.CONNECTED_ACCOUNTS],
          subItems: [
            {
              label: t`Surel`,
              path: SettingsPath.AccountsEmails,
              Icon: IconMail,
              isHidden: !permissionMap[PermissionFlagType.CONNECTED_ACCOUNTS],
              indentationLevel: 2,
            },
            {
              label: t`Kalender`,
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
      label: t`Ruang Kerja`,
      items: [
        {
          label: t`Umum`,
          path: SettingsPath.Workspace,
          Icon: IconSettings,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          label: t`Model Data`,
          path: SettingsPath.Objects,
          Icon: IconHierarchy2,
          isHidden: !permissionMap[PermissionFlagType.DATA_MODEL],
        },
        {
          label: t`Anggota`,
          path: SettingsPath.WorkspaceMembersPage,
          Icon: IconUsers,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE_MEMBERS],
        },
        {
          label: t`Tagihan`,
          path: SettingsPath.Billing,
          Icon: IconCurrencyDollar,
          isHidden:
            !isBillingEnabled || !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          // API key, webhook, dan playground adalah surface developer teknis.
          // Disembunyikan dari navigasi pengguna utama sesuai arah produk Bades
          // (kapabilitas internal tim, bukan fitur perangkat desa).
          // Route tetap aktif untuk akses tim internal yang memiliki izin.
          label: t`API & Webhook`,
          path: SettingsPath.ApiWebhooks,
          Icon: IconApi,
          isHidden: true,
        },
        // TODO: Re-enable when integrations page is ready
        // {
        //   label: t`Integrations`,
        //   path: SettingsPath.Integrations,
        //   Icon: IconApps,
        //   isHidden: !permissionMap[PermissionFlagType.API_KEYS_AND_WEBHOOKS],
        // },
        {
          // Sistem aplikasi diposisikan sebagai kapabilitas internal tim Bades,
          // bukan workflow self-service untuk perangkat desa. Disembunyikan dari
          // navigasi pengguna utama; route tetap ada untuk tim internal.
          label: t`Apps`,
          path: SettingsPath.Applications,
          Icon: IconPlug,
          isHidden: true,
          modifier: 'new',
        },
        {
          label: t`AI`,
          path: SettingsPath.AI,
          Icon: IconSparkles,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE],
          modifier: 'new',
        },
        {
          label: t`Keamanan`,
          path: SettingsPath.Security,
          Icon: IconKey,
          isAdvanced: true,
          isHidden: !permissionMap[PermissionFlagType.SECURITY],
        },
      ],
    },
    {
      label: t`Lainnya`,
      items: [
        {
          label: t`Panel Admin`,
          path: SettingsPath.AdminPanel,
          Icon: IconServer,
          isHidden: !isAdminEnabled,
        },
        {
          // Update/release center adalah workflow operasional tim Bades, bukan
          // bagian dari pengalaman pengguna balai desa pada layanan terkelola.
          label: t`Updates`,
          path: SettingsPath.Updates,
          Icon: IconRocket,
          isHidden: true,
        },
        {
          label: t`Bantuan`,
          onClick: () => window.FrontChat?.('show'),
          Icon: IconMessage,
          isHidden: !isSupportChatConfigured,
        },
        {
          label: t`Dokumentasi`,
          onClick: () =>
            window.open(
              getDocumentationUrl({ locale: currentWorkspaceMember?.locale }),
              '_blank',
            ),
          Icon: IconHelpCircle,
        },
        {
          label: t`Keluar`,
          onClick: signOut,
          Icon: IconDoorEnter,
          matchSubPages: false,
        },
      ],
    },
  ];
};

export { useSettingsNavigationItems };
