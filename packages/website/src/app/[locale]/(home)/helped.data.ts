import { msg } from '@lingui/core/macro';
import type { HeadingCardType } from '@/sections/Helped';

export const HELPED_CARDS: HeadingCardType[] = [
  {
    icon: 'w3villa',
    heading: msg`Bangun sistem layanan di atas Bades.id`,
    body: msg`Desa Suka Maju membangun sistem pelayanan warga berbasis AI dalam skala besar, dengan Bades.id sebagai tulang punggung operasional administrasi desa.`,
    illustration: 'target',
    href: '/customers/w3villa',
  },
  {
    icon: 'act-education',
    heading: msg`Kuasai sistem informasi desa dari hulu ke hilir`,
    body: msg`Desa Mekar Jaya mengganti sistem lama yang tidak lagi didukung dengan Bades.id dan memangkas biaya operasional sistem informasi hingga lebih dari 90%.`,
    illustration: 'spaceship',
    href: '/customers/act-education',
  },
  {
    icon: 'netzero',
    heading: msg`Tumbuh dengan fondasi yang fleksibel`,
    body: msg`Kecamatan Harapan Baru menjalankan Bades.id secara modular di seluruh layanan administrasi, program bantuan sosial, dan sistem pemantauan aset wilayah.`,
    illustration: 'money',
    href: '/customers/netzero',
  },
];
