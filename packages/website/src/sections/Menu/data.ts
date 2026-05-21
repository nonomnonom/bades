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
  imageAlt: 'Bades.id latest release',
  imageScale: 1.04,
  title: msg`See the latest release`,
  description: msg`Track every release with changelogs, highlights and demos of the newest features.`,
};

function buildNavItems(): MenuNavItemType[] {
  const releasesPreview =
    getLatestReleasePreview() ?? FALLBACK_RELEASES_PREVIEW;

  return [
    { label: msg`Why`, href: '/why-bades' },
    {
      label: msg`Resources`,
      children: [
        {
          label: msg`User Guide`,
          description: msg`Learn how to use Bades.id`,
          href: 'https://docs.bades.id/user-guide/introduction',
          external: true,
          icon: 'book',
          preview: {
            image: '/images/shared/menu/user-guide-preview.webp',
            imageAlt: 'Bades.id user guide preview',
            title: msg`Master every corner of Bades.id`,
            description: msg`Step-by-step guides and playbooks to help your team get the most out of their village administration system.`,
          },
        },
        {
          label: msg`Developers`,
          description: msg`Create apps on Bades.id`,
          href: 'https://docs.bades.id/developers/introduction',
          external: true,
          icon: 'code',
          preview: {
            image: '/images/shared/menu/developers-preview.webp',
            imageAlt: 'Blue developer illustration with branching arrows',
            imagePosition: 'center',
            imageScale: 1.6,
            title: msg`Build on an open platform`,
            description: msg`APIs, SDKs and webhooks to extend Bades.id and ship apps on top of your village data.`,
          },
        },
        {
          label: msg`Partners`,
          description: msg`Find a Bades.id partner`,
          href: '/partners',
          icon: 'users',
          preview: {
            image: '/images/partner/hero/hero.webp',
            imageAlt: 'Bades.id partner ecosystem',
            imagePosition: 'center',
            title: msg`Team up with a Bades.id expert`,
            description: msg`Meet the certified agencies and consultants implementing Bades.id for villages across Indonesia.`,
          },
        },
        {
          label: msg`Releases`,
          description: msg`Discover what's new`,
          href: '/releases',
          icon: 'tag',
          preview: releasesPreview,
        },
      ],
    },
    { label: msg`Customers`, href: '/customers' },
    { label: msg`Pricing`, href: '/pricing' },
  ];
}

const SOCIAL_LINKS: MenuSocialLinkType[] = [
  {
    ariaLabel: 'GitHub (opens in new tab)',
    href: 'https://github.com/badesid/bades',
    icon: 'github',
    showInDesktop: true,
    showInDrawer: true,
  },
  {
    ariaLabel: 'Discord (opens in new tab)',
    className: 'discord-link',
    href: 'https://discord.gg/badesid',
    icon: 'discord',
    showInDesktop: true,
    showInDrawer: true,
  },
  {
    ariaLabel: 'LinkedIn (opens in new tab)',
    href: 'https://www.linkedin.com/company/badesid',
    icon: 'linkedin',
    showInDesktop: false,
    showInDrawer: true,
  },
  {
    ariaLabel: 'X (opens in new tab)',
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
