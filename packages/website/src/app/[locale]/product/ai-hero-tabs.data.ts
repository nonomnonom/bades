import { msg } from '@lingui/core/macro';

import type { TabType } from '@/sections/Tabs';

export const AI_HERO_TABS: TabType[] = [
  {
    body: msg`Tampilkan semua permohonan layanan yang belum diselesaikan bulan ini`,
    icon: 'search',
  },
  {
    body: msg`Buat agenda tindak lanjut untuk 10 warga yang permohonannya menunggu verifikasi`,
    icon: 'check',
  },
  {
    body: msg`Ringkaskan riwayat layanan warga ini`,
    icon: 'edit',
  },
  {
    body: msg`Buat alur kerja yang mengirimkan notifikasi saat surat selesai diterbitkan`,
    icon: 'code',
  },
];
