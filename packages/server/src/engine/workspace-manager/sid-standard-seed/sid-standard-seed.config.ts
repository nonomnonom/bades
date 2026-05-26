import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';
import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/object-metadata-seed.type';

import { ANGGARAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/anggaran-custom-field-seeds.constant';
import { ASET_DESA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/aset-desa-custom-field-seeds.constant';
import { BIDANG_ANGGARAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/bidang-anggaran-custom-field-seeds.constant';
import { BIDANG_TANAH_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/bidang-tanah-custom-field-seeds.constant';
import { JABATAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/jabatan-custom-field-seeds.constant';
import { JENIS_SURAT_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/jenis-surat-custom-field-seeds.constant';
import { KEGIATAN_ANGGARAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/kegiatan-anggaran-custom-field-seeds.constant';
import { KEGIATAN_DESA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/kegiatan-desa-custom-field-seeds.constant';
import { KELUARGA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/keluarga-custom-field-seeds.constant';
import { LEMBAGA_DESA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/lembaga-desa-custom-field-seeds.constant';
import { PENDUDUK_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/penduduk-custom-field-seeds.constant';
import { PENERIMA_BANTUAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/penerima-bantuan-custom-field-seeds.constant';
import { PERIODE_JABATAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/periode-jabatan-custom-field-seeds.constant';
import { PERMOHONAN_SURAT_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/permohonan-surat-custom-field-seeds.constant';
import { POSYANDU_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/posyandu-custom-field-seeds.constant';
import { PROGRAM_BANTUAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/program-bantuan-custom-field-seeds.constant';
import { REALISASI_ANGGARAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/realisasi-anggaran-custom-field-seeds.constant';
import { RUMAH_TANGGA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/rumah-tangga-custom-field-seeds.constant';
import { SUMBER_DANA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/sumber-dana-custom-field-seeds.constant';
import { SURAT_KELUAR_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/surat-keluar-custom-field-seeds.constant';
import { SURAT_MASUK_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/surat-masuk-custom-field-seeds.constant';
import { UMKM_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/umkm-custom-field-seeds.constant';
import { WILAYAH_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/wilayah-custom-field-seeds.constant';

import { ANGGARAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/anggaran-custom-object-seed.constant';
import { ASET_DESA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/aset-desa-custom-object-seed.constant';
import { BIDANG_ANGGARAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/bidang-anggaran-custom-object-seed.constant';
import { BIDANG_TANAH_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/bidang-tanah-custom-object-seed.constant';
import { JABATAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/jabatan-custom-object-seed.constant';
import { JENIS_SURAT_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/jenis-surat-custom-object-seed.constant';
import { KEGIATAN_ANGGARAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/kegiatan-anggaran-custom-object-seed.constant';
import { KEGIATAN_DESA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/kegiatan-desa-custom-object-seed.constant';
import { KELUARGA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/keluarga-custom-object-seed.constant';
import { LEMBAGA_DESA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/lembaga-desa-custom-object-seed.constant';
import { PENDUDUK_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/penduduk-custom-object-seed.constant';
import { PENERIMA_BANTUAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/penerima-bantuan-custom-object-seed.constant';
import { PERIODE_JABATAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/periode-jabatan-custom-object-seed.constant';
import { PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/permohonan-surat-custom-object-seed.constant';
import { POSYANDU_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/posyandu-custom-object-seed.constant';
import { PROGRAM_BANTUAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/program-bantuan-custom-object-seed.constant';
import { REALISASI_ANGGARAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/realisasi-anggaran-custom-object-seed.constant';
import { RUMAH_TANGGA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/rumah-tangga-custom-object-seed.constant';
import { SUMBER_DANA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/sumber-dana-custom-object-seed.constant';
import { SURAT_KELUAR_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/surat-keluar-custom-object-seed.constant';
import { SURAT_MASUK_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/surat-masuk-custom-object-seed.constant';
import { UMKM_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/umkm-custom-object-seed.constant';
import { WILAYAH_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/wilayah-custom-object-seed.constant';

export type SidStandardObjectSeed = {
  object: ObjectMetadataSeed;
  fields: FieldMetadataSeed[];
};

// Bades SID Standard Seed — 23 objek inti yang ditanam ke setiap workspace
// Bades sebagai pengganti CRM company/person/opportunity.
//
// Sesuai GOAL.md, 6 domain:
//   1. Demografi & Wilayah: Penduduk, Keluarga, Rumah Tangga, Wilayah
//   2. Pemerintahan Desa: Jabatan, Periode Jabatan, Lembaga Desa
//   3. Pelayanan Surat: Jenis Surat, Permohonan Surat, Surat Keluar, Surat Masuk
//   4. Keuangan Desa: Anggaran, Bidang Anggaran, Kegiatan Anggaran,
//      Realisasi Anggaran, Sumber Dana
//   5. Program Sosial & Bantuan: Program Bantuan, Penerima Bantuan, Posyandu
//   6. Aset & Ekonomi: Aset Desa, Bidang Tanah, UMKM, Kegiatan Desa
//
// Urutan penting: object yang menjadi referensi (Wilayah, Penduduk, Keluarga)
// di-seed lebih dulu agar relasi turunan bisa di-resolve.
export const SID_STANDARD_OBJECT_SEEDS: SidStandardObjectSeed[] = [
  // 1. Demografi & Wilayah
  { object: WILAYAH_CUSTOM_OBJECT_SEED, fields: WILAYAH_CUSTOM_FIELD_SEEDS },
  { object: PENDUDUK_CUSTOM_OBJECT_SEED, fields: PENDUDUK_CUSTOM_FIELD_SEEDS },
  { object: KELUARGA_CUSTOM_OBJECT_SEED, fields: KELUARGA_CUSTOM_FIELD_SEEDS },
  {
    object: RUMAH_TANGGA_CUSTOM_OBJECT_SEED,
    fields: RUMAH_TANGGA_CUSTOM_FIELD_SEEDS,
  },

  // 2. Pemerintahan Desa
  { object: JABATAN_CUSTOM_OBJECT_SEED, fields: JABATAN_CUSTOM_FIELD_SEEDS },
  {
    object: PERIODE_JABATAN_CUSTOM_OBJECT_SEED,
    fields: PERIODE_JABATAN_CUSTOM_FIELD_SEEDS,
  },
  {
    object: LEMBAGA_DESA_CUSTOM_OBJECT_SEED,
    fields: LEMBAGA_DESA_CUSTOM_FIELD_SEEDS,
  },

  // 3. Pelayanan Surat
  {
    object: JENIS_SURAT_CUSTOM_OBJECT_SEED,
    fields: JENIS_SURAT_CUSTOM_FIELD_SEEDS,
  },
  {
    object: PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED,
    fields: PERMOHONAN_SURAT_CUSTOM_FIELD_SEEDS,
  },
  {
    object: SURAT_KELUAR_CUSTOM_OBJECT_SEED,
    fields: SURAT_KELUAR_CUSTOM_FIELD_SEEDS,
  },
  {
    object: SURAT_MASUK_CUSTOM_OBJECT_SEED,
    fields: SURAT_MASUK_CUSTOM_FIELD_SEEDS,
  },

  // 4. Keuangan Desa
  {
    object: BIDANG_ANGGARAN_CUSTOM_OBJECT_SEED,
    fields: BIDANG_ANGGARAN_CUSTOM_FIELD_SEEDS,
  },
  {
    object: SUMBER_DANA_CUSTOM_OBJECT_SEED,
    fields: SUMBER_DANA_CUSTOM_FIELD_SEEDS,
  },
  { object: ANGGARAN_CUSTOM_OBJECT_SEED, fields: ANGGARAN_CUSTOM_FIELD_SEEDS },
  {
    object: KEGIATAN_ANGGARAN_CUSTOM_OBJECT_SEED,
    fields: KEGIATAN_ANGGARAN_CUSTOM_FIELD_SEEDS,
  },
  {
    object: REALISASI_ANGGARAN_CUSTOM_OBJECT_SEED,
    fields: REALISASI_ANGGARAN_CUSTOM_FIELD_SEEDS,
  },

  // 5. Program Sosial & Bantuan
  {
    object: PROGRAM_BANTUAN_CUSTOM_OBJECT_SEED,
    fields: PROGRAM_BANTUAN_CUSTOM_FIELD_SEEDS,
  },
  {
    object: PENERIMA_BANTUAN_CUSTOM_OBJECT_SEED,
    fields: PENERIMA_BANTUAN_CUSTOM_FIELD_SEEDS,
  },
  { object: POSYANDU_CUSTOM_OBJECT_SEED, fields: POSYANDU_CUSTOM_FIELD_SEEDS },

  // 6. Aset & Ekonomi
  {
    object: ASET_DESA_CUSTOM_OBJECT_SEED,
    fields: ASET_DESA_CUSTOM_FIELD_SEEDS,
  },
  {
    object: BIDANG_TANAH_CUSTOM_OBJECT_SEED,
    fields: BIDANG_TANAH_CUSTOM_FIELD_SEEDS,
  },
  { object: UMKM_CUSTOM_OBJECT_SEED, fields: UMKM_CUSTOM_FIELD_SEEDS },
  {
    object: KEGIATAN_DESA_CUSTOM_OBJECT_SEED,
    fields: KEGIATAN_DESA_CUSTOM_FIELD_SEEDS,
  },
];
