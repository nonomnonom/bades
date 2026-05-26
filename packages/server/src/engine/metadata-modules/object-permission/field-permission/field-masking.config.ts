/**
 * Konfigurasi statis masking field per role untuk kepatuhan UU PDP
 * (Undang-Undang Perlindungan Data Pribadi).
 *
 * GOAL.md baris 402-403:
 *   "Privasi data warga harus mengikuti UU PDP, termasuk masking NIK untuk
 *    role tertentu."
 *
 * Strategi: konfigurasi rule berbasis nama object + nama field + label role.
 * Saat field di-fetch oleh user yang role-nya **tidak** ada di
 * `exemptRoleLabels`, value akan di-mask sesuai `strategy` sebelum dikembalikan.
 *
 * Role exempt default: 'Admin' dan 'Kepala Desa' lihat value lengkap.
 * Role lain (Sekretaris, Staf, Member) lihat value masked.
 *
 * Implementasi hookup ke jalur fetch (formatResult / GraphQL resolver
 * intercept) bersifat infra terpisah — config + util ini adalah foundation
 * yang siap di-reuse saat layer fetch di-instrument.
 */

export type FieldMaskingStrategy = 'PARTIAL_MASK' | 'FULL_MASK';

export type FieldMaskingPartialConfig = {
  strategy: 'PARTIAL_MASK';
  /** Jumlah karakter prefix yang tetap terlihat. */
  showPrefix: number;
  /** Jumlah karakter suffix yang tetap terlihat. */
  showSuffix: number;
  /** Karakter pengganti untuk bagian tengah. Default `x`. */
  maskChar?: string;
};

export type FieldMaskingFullConfig = {
  strategy: 'FULL_MASK';
  /** String pengganti penuh. Default `'***'`. */
  replacement?: string;
};

export type FieldMaskingConfig =
  | FieldMaskingPartialConfig
  | FieldMaskingFullConfig;

export type FieldMaskingRule = {
  /** Nama object metadata (singular), mis. `'penduduk'`. */
  objectNameSingular: string;
  /** Nama field metadata, mis. `'nik'`. */
  fieldName: string;
  /** Label role yang exempt — lihat value lengkap tanpa mask. */
  exemptRoleLabels: string[];
  /** Konfigurasi strategi masking. */
  config: FieldMaskingConfig;
};

/**
 * Daftar rule masking field Bades.
 *
 * Tambahkan rule baru di sini saat ada field sensitif yang butuh masking.
 * Field di seed standar SID (lihat `sid-standard-seed.config.ts`) yang
 * sensitif: NIK, nomor KK, akta lahir, dst. Saat ini hanya NIK yang
 * di-mask default — yang lain bisa ditambahkan sesuai kebijakan operasional
 * desa.
 */
export const FIELD_MASKING_RULES: FieldMaskingRule[] = [
  {
    objectNameSingular: 'penduduk',
    fieldName: 'nik',
    exemptRoleLabels: ['Admin', 'Kepala Desa'],
    config: {
      strategy: 'PARTIAL_MASK',
      showPrefix: 4,
      showSuffix: 3,
      maskChar: 'x',
    },
  },
];

/**
 * Lookup rule yang berlaku untuk kombinasi object+field tertentu.
 * Return `null` jika tidak ada rule yang cocok.
 */
export const findFieldMaskingRule = (
  objectNameSingular: string,
  fieldName: string,
): FieldMaskingRule | null => {
  return (
    FIELD_MASKING_RULES.find(
      (rule) =>
        rule.objectNameSingular === objectNameSingular &&
        rule.fieldName === fieldName,
    ) ?? null
  );
};
