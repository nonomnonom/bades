import { msg } from '@lingui/core/macro';
import { getLatestReleasePreview } from '@/lib/releases/get-latest-release-preview';
import type {
  MenuDataType,
  MenuNavChildPreview,
  MenuNavItemType,
  MenuSocialLinkType,
} from '@/sections/Menu/types';

const FALLBACK_RELEASES_PREVIEW: MenuNavChildPreview = {
  image: '/images/releases/1.23/1.23.0-easier-layouts.webp',
  imageAlt: 'Rilis terbaru Bades.id',
  imageScale: 1.04,
  title: msg`Lihat rilis terbaru`,
  description: msg`Pantau setiap rilis dengan changelog, highlight, dan demo fitur terbaru.`,
};

function buildNavItems(): MenuNavItemType[] {
  const releasesPreview =
    getLatestReleasePreview() ?? FALLBACK_RELEASES_PREVIEW;

  return [
    { label: msg`Mengapa Bades`, href: '/why-bades' },
    {
      label: msg`Sumber`,
      children: [
        {
          label: msg`Panduan Pengguna`,
          description: msg`Pelajari cara menggunakan Bades.id`,
          href: 'https://docs.bades.id/user-guide/introduction',
          external: true,
          icon: 'book',
          preview: {
            image: '/images/shared/menu/user-guide-preview.webp',
            imageAlt: 'Pratinjau panduan pengguna Bades.id',
            title: msg`Kuasai setiap sudut Bades.id`,
            description: msg`Panduan langkah demi langkah dan playbook untuk membantu tim Anda memaksimalkan sistem administrasi desa mereka.`,
          },
        },
        {
          label: msg`Developer`,
          description: msg`Buat aplikasi di Bades.id`,
          href: 'https://docs.bades.id/developers/introduction',
          external: true,
          icon: 'code',
          preview: {
            image: '/images/shared/menu/developers-preview.webp',
            imageAlt: 'Ilustrasi developer biru dengan panah bercabang',
            imagePosition: 'center',
            imageScale: 1.6,
            title: msg`Bangun di platform terbuka`,
            description: msg`API, SDK, dan webhook untuk memperluas Bades.id dan mengirim aplikasi di atas data desa Anda.`,
          },
        },
        {
          label: msg`Partner`,
          description: msg`Temukan partner Bades.id`,
          href: '/partners',
          icon: 'users',
          preview: {
            image: '/images/partner/hero/hero.webp',
            imageAlt: 'Ekosistem partner Bades.id',
            imagePosition: 'center',
            title: msg`Berkolaborasi dengan ahli Bades.id`,
            description: msg`Temukan agen dan konsultan bersertifikat yang mengimplementasikan Bades.id untuk desa-desa di Indonesia.`,
          },
        },
        {
          label: msg`Rilis`,
          description: msg`Temukan apa yang baru`,
          href: '/releases',
          icon: 'tag',
          preview: releasesPreview,
        },
      ],
    },
    { label: msg`Pelanggan`, href: '/customers' },
    { label: msg`Harga`, href: '/pricing' },
  ];
}

const SOCIAL_LINKS: MenuSocialLinkType[] = [
  {
    ariaLabel: 'GitHub (buka di tab baru)',
    href: 'https://github.com/badesid/bades',
    icon: 'github',
    showInDesktop: true,
    showInDrawer: true,
  },
  {
    ariaLabel: 'Discord (buka di tab baru)',
    className: 'discord-link',
    href: 'https://discord.gg/badesid',
    icon: 'discord',
    showInDesktop: true,
    showInDrawer: true,
  },
  {
    ariaLabel: 'LinkedIn (buka di tab baru)',
    href: 'https://www.linkedin.com/company/badesid',
    icon: 'linkedin',
    showInDesktop: false,
    showInDrawer: true,
  },
  {
    ariaLabel: 'X (buka di tab baru)',
    href: 'https://x.com/badesid',
    icon: 'x',
    showInDesktop: false,
    showInDrawer: true,
  },
];

export const MENU_DATA: MenuDataType = {
  get navItems() {
    return buildNavItems();
  },
  socialLinks: SOCIAL_LINKS,
};
