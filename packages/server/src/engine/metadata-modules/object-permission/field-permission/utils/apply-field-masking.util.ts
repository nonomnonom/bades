import {
  type FieldMaskingConfig,
  findFieldMaskingRule,
} from 'src/engine/metadata-modules/object-permission/field-permission/field-masking.config';

/**
 * Terapkan strategi masking ke sebuah string value.
 *
 * Strategi:
 * - `PARTIAL_MASK`: pertahankan `showPrefix` chars di depan + `showSuffix`
 *   chars di belakang, ganti tengah dengan `maskChar`. Jumlah mask char
 *   = total length - showPrefix - showSuffix (minimal 1).
 *   Contoh NIK 16-digit (showPrefix=4, showSuffix=3, maskChar='x'):
 *     `3201010101010001` → `3201xxxxxxxxx001`
 * - `FULL_MASK`: ganti seluruh value dengan `replacement` (default `'***'`).
 *
 * Jika value `null`/`undefined`/empty string, dikembalikan apa adanya.
 * Jika value lebih pendek dari showPrefix+showSuffix (partial mask),
 * kembalikan FULL_MASK fallback agar tidak membocorkan value secara
 * tidak sengaja.
 */
export const applyFieldMasking = (
  value: string | null | undefined,
  config: FieldMaskingConfig,
): string | null | undefined => {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  if (config.strategy === 'FULL_MASK') {
    return config.replacement ?? '***';
  }

  // PARTIAL_MASK
  const { showPrefix, showSuffix, maskChar = 'x' } = config;
  const length = value.length;

  if (length <= showPrefix + showSuffix) {
    // Tidak cukup karakter untuk memperlihatkan prefix+suffix tanpa overlap.
    // Fallback: mask penuh agar tidak bocor.
    return maskChar.repeat(Math.max(length, 1));
  }

  const prefix = value.slice(0, showPrefix);
  const suffix = value.slice(length - showSuffix);
  const maskLength = length - showPrefix - showSuffix;

  return prefix + maskChar.repeat(maskLength) + suffix;
};

/**
 * Helper konvensional untuk masking field di hasil fetch record.
 *
 * Pakai pattern:
 *   const masked = maskFieldValueForRole({
 *     objectNameSingular: 'penduduk',
 *     fieldName: 'nik',
 *     value: record.nik,
 *     roleLabels: ['Sekretaris'],
 *   });
 *
 * - Jika tidak ada rule untuk object+field tersebut → return value apa adanya.
 * - Jika user punya role di `exemptRoleLabels` rule → return value lengkap.
 * - Selain itu → return masked value sesuai config.
 */
export const maskFieldValueForRole = ({
  objectNameSingular,
  fieldName,
  value,
  roleLabels,
}: {
  objectNameSingular: string;
  fieldName: string;
  value: string | null | undefined;
  roleLabels: string[];
}): string | null | undefined => {
  const rule = findFieldMaskingRule(objectNameSingular, fieldName);

  if (rule === null) {
    return value;
  }

  const isExempt = roleLabels.some((label) =>
    rule.exemptRoleLabels.includes(label),
  );

  if (isExempt) {
    return value;
  }

  return applyFieldMasking(value, rule.config);
};
