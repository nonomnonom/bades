import { FieldMetadataType, RelationType } from 'shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';
import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/object-metadata-seed.type';

import { ASET_DESA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/aset-desa-custom-field-seeds.constant';
import { JABATAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/jabatan-custom-field-seeds.constant';
import { KELUARGA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/keluarga-custom-field-seeds.constant';
import { PENDUDUK_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/penduduk-custom-field-seeds.constant';
import { PENERIMA_BANTUAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/penerima-bantuan-custom-field-seeds.constant';
import { PERMOHONAN_SURAT_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/permohonan-surat-custom-field-seeds.constant';
import { PROGRAM_BANTUAN_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/program-bantuan-custom-field-seeds.constant';
import { SURAT_KELUAR_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/surat-keluar-custom-field-seeds.constant';
import { WILAYAH_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/wilayah-custom-field-seeds.constant';

import { ASET_DESA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/aset-desa-custom-object-seed.constant';
import { JABATAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/jabatan-custom-object-seed.constant';
import { KELUARGA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/keluarga-custom-object-seed.constant';
import { PENDUDUK_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/penduduk-custom-object-seed.constant';
import { PENERIMA_BANTUAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/penerima-bantuan-custom-object-seed.constant';
import { PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/permohonan-surat-custom-object-seed.constant';
import { PROGRAM_BANTUAN_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/program-bantuan-custom-object-seed.constant';
import { SURAT_KELUAR_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/surat-keluar-custom-object-seed.constant';
import { WILAYAH_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/wilayah-custom-object-seed.constant';

export type SidStandardObjectSeed = {
  object: ObjectMetadataSeed;
  fields: FieldMetadataSeed[];
};

// Bades SID Standard Seed — 9 object inti yang ditanam ke setiap workspace
// Bades sebagai pengganti CRM company/person/opportunity. Object generik
// `note` (Catatan) dan `task` (Tugas) tetap berasal dari engine standar,
// tidak perlu seed terpisah di sini.
//
// Sesuai GOAL.md, scope ringkas:
//   1. Penduduk     — fondasi data warga (Permendagri 109/2019)
//   2. Keluarga     — KK (Permendagri 12/2007 + indikator BPS)
//   3. Wilayah      — Dusun/RW/RT hierarkis
//   4. Layanan      — permohonan surat oleh warga (modul layanan OpenSID)
//   5. Surat        — arsip surat masuk/keluar (Permendagri 47/2016)
//   6. Perangkat Desa — penduduk yang menjabat (UU 6/2014 + Permendagri 67/2017)
//   7. Program Bantuan — PKH/BLT-DD/BPNT/RTLH/PIP/KIS/dll
//   8. Penerima Bantuan — junction Program Bantuan ↔ Penduduk/Keluarga
//   9. Aset Desa    — Permendagri 1/2016 tentang Pengelolaan Aset Desa
//
// Urutan penting: object yang menjadi referensi (Wilayah, Penduduk, Keluarga)
// di-seed lebih dulu agar relasi turunan bisa di-resolve.
//
// Catatan: SURAT_KELUAR di-seed sebagai object `Surat` (mencakup masuk+keluar
// via field `arah_surat`) dan JABATAN di-seed sebagai object `Perangkat
// Desa`. Reshape label/field final mengikuti spek GOAL.md masih dalam
// proses migrasi bertahap dari struktur warisan dev-seeder.

// Relasi MANY_TO_ONE antar object SID standar.
// Setiap relasi membuat FK column `{fieldName}Id` di source object table
// dan reverse field (ONE_TO_MANY) di target object.
//
// (01) Jabatan.penduduk      → Penduduk       — column `pendudukId`
// (02) Jabatan.wilayah       → Wilayah        — column `wilayahId`
// (03) PermohonanSurat.penduduk → Penduduk    — column `pendudukId`
// (04) PermohonanSurat.petugas → Penduduk     — column `petugasId`
// (05) PenerimaBantuan.programBantuan → ProgramBantuan — column `programBantuanId`
// (06) PenerimaBantuan.penduduk → Penduduk    — column `pendudukId`
// (07) Penduduk.kartuKeluarga    → Keluarga   — column `kartuKeluargaId`
export type SidStandardRelationSeed = {
  sourceObjectNameSingular: string;
  fieldName: string;
  fieldLabel: string;
  fieldIcon: string;
  targetObjectNameSingular: string;
  targetFieldLabel: string;
  targetFieldIcon: string;
};

export const SID_STANDARD_RELATIONS: SidStandardRelationSeed[] = [
  // Jabatan → Penduduk (pemegang jabatan)
  {
    sourceObjectNameSingular: 'jabatan',
    fieldName: 'penduduk',
    fieldLabel: 'Pemegang Jabatan',
    fieldIcon: 'IconUser',
    targetObjectNameSingular: 'penduduk',
    targetFieldLabel: 'Jabatan',
    targetFieldIcon: 'IconIdBadge',
  },
  // Jabatan → Wilayah (wilayah binaan, khusus Kadus/RT/RW)
  {
    sourceObjectNameSingular: 'jabatan',
    fieldName: 'wilayah',
    fieldLabel: 'Wilayah',
    fieldIcon: 'IconMapPin',
    targetObjectNameSingular: 'wilayah',
    targetFieldLabel: 'Jabatan Wilayah',
    targetFieldIcon: 'IconIdBadge',
  },
  // PermohonanSurat → Penduduk (pemohon)
  {
    sourceObjectNameSingular: 'permohonanSurat',
    fieldName: 'penduduk',
    fieldLabel: 'Pemohon',
    fieldIcon: 'IconUser',
    targetObjectNameSingular: 'penduduk',
    targetFieldLabel: 'Permohonan',
    targetFieldIcon: 'IconClipboardList',
  },
  // PermohonanSurat → Penduduk (petugas pemroses)
  {
    sourceObjectNameSingular: 'permohonanSurat',
    fieldName: 'petugas',
    fieldLabel: 'Petugas',
    fieldIcon: 'IconUserCog',
    targetObjectNameSingular: 'penduduk',
    targetFieldLabel: 'Diproses Oleh',
    targetFieldIcon: 'IconClipboardList',
  },
  // PenerimaBantuan → ProgramBantuan
  {
    sourceObjectNameSingular: 'penerimaBantuan',
    fieldName: 'programBantuan',
    fieldLabel: 'Program Bantuan',
    fieldIcon: 'IconGift',
    targetObjectNameSingular: 'programBantuan',
    targetFieldLabel: 'Penerima Bantuan',
    targetFieldIcon: 'IconHandHeart',
  },
  // PenerimaBantuan → Penduduk
  {
    sourceObjectNameSingular: 'penerimaBantuan',
    fieldName: 'penduduk',
    fieldLabel: 'Penduduk',
    fieldIcon: 'IconUser',
    targetObjectNameSingular: 'penduduk',
    targetFieldLabel: 'Bantuan Diterima',
    targetFieldIcon: 'IconHandHeart',
  },
  // Penduduk → Keluarga (kartu keluarga tempat warga terdaftar)
  {
    sourceObjectNameSingular: 'penduduk',
    fieldName: 'kartuKeluarga',
    fieldLabel: 'Kartu Keluarga',
    fieldIcon: 'IconHome',
    targetObjectNameSingular: 'keluarga',
    targetFieldLabel: 'Anggota Keluarga',
    targetFieldIcon: 'IconUsers',
  },
];

export const SID_STANDARD_OBJECT_SEEDS: SidStandardObjectSeed[] = [
  // 1. Demografi & Wilayah
  { object: WILAYAH_CUSTOM_OBJECT_SEED, fields: WILAYAH_CUSTOM_FIELD_SEEDS },
  { object: PENDUDUK_CUSTOM_OBJECT_SEED, fields: PENDUDUK_CUSTOM_FIELD_SEEDS },
  { object: KELUARGA_CUSTOM_OBJECT_SEED, fields: KELUARGA_CUSTOM_FIELD_SEEDS },

  // 2. Pelayanan Surat
  {
    object: PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED,
    fields: PERMOHONAN_SURAT_CUSTOM_FIELD_SEEDS,
  },
  {
    object: SURAT_KELUAR_CUSTOM_OBJECT_SEED,
    fields: SURAT_KELUAR_CUSTOM_FIELD_SEEDS,
  },

  // 3. Pemerintahan Desa
  { object: JABATAN_CUSTOM_OBJECT_SEED, fields: JABATAN_CUSTOM_FIELD_SEEDS },

  // 4. Program Sosial & Bantuan
  {
    object: PROGRAM_BANTUAN_CUSTOM_OBJECT_SEED,
    fields: PROGRAM_BANTUAN_CUSTOM_FIELD_SEEDS,
  },
  {
    object: PENERIMA_BANTUAN_CUSTOM_OBJECT_SEED,
    fields: PENERIMA_BANTUAN_CUSTOM_FIELD_SEEDS,
  },

  // 5. Aset Desa
  {
    object: ASET_DESA_CUSTOM_OBJECT_SEED,
    fields: ASET_DESA_CUSTOM_FIELD_SEEDS,
  },
];
