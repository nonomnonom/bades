import { t } from '~/utils/i18n/badesI18n';

export const getStandardApplicationDescription =
  (): string => t`Model data dasar yang menjadi fondasi setiap workspace Bades.id.

#### Arti "fondasi"

Setiap workspace Bades.id dimulai dari kumpulan objek ini. Objek-objek inilah yang membentuk Sistem Informasi Desa Anda — mulai dari data warga, layanan, hingga administrasi desa. Bagian lain dari sistem bekerja di atas fondasi ini.

#### Objek yang termasuk
- **Warga & Keluarga**: data penduduk dan kartu keluarga
- **Permohonan Layanan**: alur layanan warga di desa
- **Surat & Dokumen**: berkas administrasi dan tindak lanjutnya
- **Anggaran & Bantuan**: perencanaan desa dan program sosial

Jika aplikasi fondasi ini dihapus, bagian lain Bades.id tidak punya tempat berpijak.`;
