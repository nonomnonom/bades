import { msg } from '@lingui/core/macro';
import type { PlansDataType } from '@/sections/Plans/types';

const PRO_HEADING = msg`Pro`;
const ORGANIZATION_HEADING = msg`Organization`;

const PRO_BULLETS_MONTHLY = [
  msg`Kustomisasi penuh`,
  msg`Buat aplikasi kustom`,
  msg`AI Agents dengan skill kustom`,
  msg`5 kredit workflow/bulan termasuk`,
  msg`Dukungan standar`,
];

const PRO_BULLETS_YEARLY = [
  msg`Kustomisasi penuh`,
  msg`Buat aplikasi kustom`,
  msg`AI Agents dengan skill kustom`,
  msg`50 kredit workflow/tahun termasuk`,
  msg`Dukungan standar`,
];

const PRO_BULLETS_SELF_HOST = [
  msg`Kustomisasi penuh`,
  msg`Buat aplikasi kustom`,
  msg`Dukungan komunitas`,
];

const ORGANIZATION_BULLETS_MONTHLY = [
  msg`Semua yang ada di Pro`,
  msg`Row-level permissions`,
  msg`SAML/OIDC SSO`,
  msg`Domain kustom`,
  msg`Dukungan prioritas`,
];

const ORGANIZATION_BULLETS_YEARLY = [
  msg`Semua yang ada di Pro`,
  msg`Row-level permissions`,
  msg`SAML/OIDC SSO`,
  msg`Domain kustom`,
  msg`Dukungan prioritas`,
];

const ORGANIZATION_BULLETS_SELF_HOST = [
  msg`Semua yang ada di Pro`,
  msg`Model AI kustom`,
  msg`Row-level permissions`,
  msg`SAML/OIDC SSO`,
  msg`Dukungan tim Bades.id`,
  msg` hingga 5 desa`,
];

export const PLANS_DATA = {
  organization: {
    cells: {
      cloud: {
        monthly: {
          featureBullets: ORGANIZATION_BULLETS_MONTHLY,
          price: { value: 190000, prefix: 'Rp ', suffix: msg`/user/bulan` },
        },
        yearly: {
          featureBullets: ORGANIZATION_BULLETS_YEARLY,
          price: { value: 150000, prefix: 'Rp ', suffix: msg`/user/bulan` },
        },
      },
      selfHost: {
        monthly: {
          featureBullets: ORGANIZATION_BULLETS_SELF_HOST,
          price: { value: 0, prefix: '$', suffix: msg`/user/bulan` },
        },
        yearly: {
          featureBullets: ORGANIZATION_BULLETS_SELF_HOST,
          price: { value: 0, prefix: '$', suffix: msg`/user/bulan` },
        },
      },
    },
    heading: ORGANIZATION_HEADING,
    icon: {
      alt: 'Ikon paket Organization',
      src: '/images/pricing/plans/organization-icon.webp',
    },
  },
  pro: {
    cells: {
      cloud: {
        monthly: {
          featureBullets: PRO_BULLETS_MONTHLY,
          price: { value: 90000, prefix: 'Rp ', suffix: msg`/user/bulan` },
        },
        yearly: {
          featureBullets: PRO_BULLETS_YEARLY,
          price: { value: 75000, prefix: 'Rp ', suffix: msg`/user/bulan` },
        },
      },
      selfHost: {
        monthly: {
          featureBullets: PRO_BULLETS_SELF_HOST,
          price: { value: 0, prefix: 'Rp ', suffix: msg`/user/bulan` },
        },
        yearly: {
          featureBullets: PRO_BULLETS_SELF_HOST,
          price: { value: 0, prefix: 'Rp ', suffix: msg`/user/bulan` },
        },
      },
    },
    heading: PRO_HEADING,
    icon: {
      alt: 'Ikon paket Pro',
      src: '/images/pricing/plans/pro-icon.webp',
      width: 60,
    },
  },
} satisfies PlansDataType;
