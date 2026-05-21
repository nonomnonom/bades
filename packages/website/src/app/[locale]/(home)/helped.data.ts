import { msg } from '@lingui/core/macro';
import type { HeadingCardType } from '@/sections/Helped';

export const HELPED_CARDS: HeadingCardType[] = [
  {
    icon: 'w3villa',
    heading: msg`Dirikan produk di Bades.id`,
    body: msg`W3villa membangun W3Grads untuk wawancara mock AI dalam skala besar, dengan Bades.id sebagai tulang punggung operasional.`,
    illustration: 'target',
    href: '/customers/w3villa',
  },
  {
    icon: 'act-education',
    heading: msg`Kuasai CRM Anda dari hulu ke hilir`,
    body: msg`AC&T mengganti CRM vendor yang sudah tidak dilanjutkan dengan Bades.id yang di-host sendiri dan memangkas biaya CRM hingga lebih dari 90%.`,
    illustration: 'spaceship',
    href: '/customers/act-education',
  },
  {
    icon: 'netzero',
    heading: msg`Tumbuh dengan fondasi yang fleksibel`,
    body: msg`NetZero menjalankan setup Bades.id modular di seluruh kredit karbon, produk pertanian, dan sistem industri.`,
    illustration: 'money',
    href: '/customers/netzero',
  },
];
