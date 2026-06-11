import { type FieldMetadataSeed } from 'src/engine/workspace-manager/sid-standard-seed/constants/types/field-metadata-seed.type';
import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/sid-standard-seed/constants/types/object-metadata-seed.type';

import { ASET_DESA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-fields/aset-desa-custom-field-seeds.constant';
import { KELUARGA_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-fields/keluarga-custom-field-seeds.constant';
import { PENDUDUK_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-fields/penduduk-custom-field-seeds.constant';
import { WILAYAH_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-fields/wilayah-custom-field-seeds.constant';

import { ASET_DESA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-objects/aset-desa-custom-object-seed.constant';
import { KELUARGA_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-objects/keluarga-custom-object-seed.constant';
import { PENDUDUK_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-objects/penduduk-custom-object-seed.constant';
import { WILAYAH_CUSTOM_OBJECT_SEED } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-objects/wilayah-custom-object-seed.constant';

export type SidStandardObjectSeed = {
  object: ObjectMetadataSeed;
  fields: FieldMetadataSeed[];
};

// Bades SID Standard Seed — 4 object inti yang ditanam ke setiap workspace.
// Object generik `note` (Catatan) dan `task` (Tugas) tetap berasal dari
// engine standar, tidak perlu seed terpisah di sini.
//
//   1. Wilayah   — Dusun/RW/RT hierarkis
//   2. Penduduk  — fondasi data warga (Permendagri 109/2019)
//   3. Keluarga  — KK (Permendagri 12/2007 + indikator BPS)
//   4. Aset Desa — Permendagri 1/2016 tentang Pengelolaan Aset Desa
//
// Urutan penting: Wilayah → Penduduk → Keluarga di-seed lebih dulu agar
// relasi turunan bisa di-resolve.

// Relasi MANY_TO_ONE antar object SID standar.
// Setiap relasi membuat FK column `{fieldName}Id` di source object table
// dan reverse field (ONE_TO_MANY) di target object.
//
// (01) Penduduk.kartuKeluarga → Keluarga — column `kartuKeluargaId`
// (02) Penduduk.wilayah       → Wilayah  — column `wilayahId`
// (03) Keluarga.wilayah       → Wilayah  — column `wilayahId`
// (04) Wilayah.wilayahInduk   → Wilayah  — column `wilayahIndukId` (self-referential)
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
  // Penduduk → Wilayah (RT tempat tinggal)
  {
    sourceObjectNameSingular: 'penduduk',
    fieldName: 'wilayah',
    fieldLabel: 'Wilayah',
    fieldIcon: 'IconMapPin',
    targetObjectNameSingular: 'wilayah',
    targetFieldLabel: 'Penduduk Wilayah',
    targetFieldIcon: 'IconUser',
  },
  // Keluarga → Wilayah (RT domisili KK)
  {
    sourceObjectNameSingular: 'keluarga',
    fieldName: 'wilayah',
    fieldLabel: 'Wilayah',
    fieldIcon: 'IconMapPin',
    targetObjectNameSingular: 'wilayah',
    targetFieldLabel: 'Keluarga Wilayah',
    targetFieldIcon: 'IconHome',
  },
  // Wilayah → Wilayah (self-referential — hierarki RT→RW→Dusun)
  {
    sourceObjectNameSingular: 'wilayah',
    fieldName: 'wilayahInduk',
    fieldLabel: 'Wilayah Induk',
    fieldIcon: 'IconArrowUp',
    targetObjectNameSingular: 'wilayah',
    targetFieldLabel: 'Sub-Wilayah',
    targetFieldIcon: 'IconArrowDown',
  },
];

export const SID_STANDARD_OBJECT_SEEDS: SidStandardObjectSeed[] = [
  // 1. Demografi & Wilayah
  { object: WILAYAH_CUSTOM_OBJECT_SEED, fields: WILAYAH_CUSTOM_FIELD_SEEDS },
  { object: PENDUDUK_CUSTOM_OBJECT_SEED, fields: PENDUDUK_CUSTOM_FIELD_SEEDS },
  { object: KELUARGA_CUSTOM_OBJECT_SEED, fields: KELUARGA_CUSTOM_FIELD_SEEDS },

  // 2. Aset Desa
  {
    object: ASET_DESA_CUSTOM_OBJECT_SEED,
    fields: ASET_DESA_CUSTOM_FIELD_SEEDS,
  },
];
