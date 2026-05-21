import { msg } from '@lingui/core/macro';
import type { FooterDataType } from '@/sections/Footer/types';

export const FOOTER_DATA: FooterDataType = {
  bottom: {
    copyright: msg`© 2026 – Bades.id`,
  },
  navGroups: [
    {
      id: 'footer-sitemap',
      title: msg`Peta Situs`,
      ctas: [],
      links: [
        { label: msg`Beranda`, href: '/', external: false },
        { label: msg`Harga`, href: '/pricing', external: false },
        { label: msg`Partner`, href: '/partners', external: false },
        {
          label: msg`Mengapa Bades`,
          href: '/why-bades',
          external: false,
        },
      ],
    },
    {
      id: 'footer-help',
      title: msg`Bantuan`,
      ctas: [],
      links: [
        {
          label: msg`Developer`,
          href: 'https://docs.bades.id/developers/introduction',
          external: true,
        },
        {
          label: msg`Panduan Pengguna`,
          href: 'https://docs.bades.id/getting-started/introduction',
          external: true,
        },
        { label: msg`Catatan Rilis`, href: '/releases', external: false },
        {
          label: msg`Generator Halftone`,
          href: '/halftone',
          external: false,
        },
      ],
    },
    {
      id: 'footer-legal',
      title: msg`Legal`,
      ctas: [],
      links: [
        {
          label: msg`Kebijakan Privasi`,
          href: '/privacy-policy',
          external: false,
        },
        { label: msg`Syarat dan Ketentuan`, href: '/terms', external: false },
      ],
    },
    {
      id: 'footer-connect',
      title: msg`Terhubung`,
      ctas: [
        {
          color: 'secondary',
          kind: 'contactModal',
          label: msg`Hubungi kami`,
          variant: 'contained',
        },
        {
          color: 'secondary',
          href: 'https://app.bades.id/welcome',
          kind: 'link',
          label: msg`Mulai`,
          variant: 'outlined',
        },
      ],
      links: [
        {
          label: msg`LinkedIn`,
          href: 'https://www.linkedin.com/company/bades',
          external: true,
        },
      ],
    },
  ],
  socialLinks: [
    {
      href: 'https://github.com/badesid/bades',
      icon: 'github',
      ariaLabel: 'GitHub (buka di tab baru)',
    },
    {
      href: 'https://discord.gg/badesid',
      icon: 'discord',
      ariaLabel: 'Discord (buka di tab baru)',
    },
    {
      href: 'https://www.linkedin.com/company/bades',
      icon: 'linkedin',
      ariaLabel: 'LinkedIn (buka di tab baru)',
    },
    {
      href: 'https://x.com/badesid',
      icon: 'x',
      ariaLabel: 'X (buka di tab baru)',
    },
  ],
};