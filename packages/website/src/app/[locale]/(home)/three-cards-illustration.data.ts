import { msg } from '@lingui/core/macro';
import type { ThreeCardsIllustrationCardType } from '@/sections/ThreeCards';

export const ILLUSTRATION_CARDS: ThreeCardsIllustrationCardType[] = [
  {
    heading: msg`Kualitas kelas produksi sejak hari pertama`,
    body: msg`Desa Suka Maju menggunakan Bades.id sebagai fondasi kelas produksi untuk model data, izin akses, autentikasi, dan mesin alur kerja yang sebelumnya harus dibangun sendiri.`,
    benefits: undefined,
    attribution: {
      role: msg`Kepala Desa`,
      company: msg`Desa Suka Maju`,
    },
    illustration: 'diamond',
    caseStudySlug: 'w3villa',
  },
  {
    heading: msg`AI untuk iterasi yang lebih cepat`,
    body: msg`Kecamatan Harapan Baru menggunakan AI asisten untuk memampatkan pekerjaan migrasi data yang biasanya membutuhkan berminggu-minggu menjadi sesuatu yang bisa dikelola satu orang dalam beberapa hari.`,
    benefits: undefined,
    attribution: {
      role: msg`Sekretaris Kecamatan`,
      company: msg`Kecamatan Harapan Baru`,
    },
    illustration: 'flash',
    caseStudySlug: 'alternative-partners',
  },
  {
    heading: msg`Kendali penuh tanpa ketergantungan vendor`,
    body: msg`Desa Mekar Jaya beralih ke Bades.id dan memangkas biaya sistem informasi lebih dari 90% tanpa kehilangan satu pun fitur yang mereka butuhkan.`,
    benefits: undefined,
    attribution: {
      role: msg`Operator Desa`,
      company: msg`Desa Mekar Jaya`,
    },
    illustration: 'lock',
    caseStudySlug: 'act-education',
  },
];
