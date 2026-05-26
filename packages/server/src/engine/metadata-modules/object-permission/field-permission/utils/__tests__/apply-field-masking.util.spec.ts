import {
  applyFieldMasking,
  maskFieldValueForRole,
} from 'src/engine/metadata-modules/object-permission/field-permission/utils/apply-field-masking.util';

describe('applyFieldMasking', () => {
  describe('PARTIAL_MASK strategy', () => {
    it('should mask NIK 16-digit dengan prefix 4 + suffix 3', () => {
      const result = applyFieldMasking('3201010101010001', {
        strategy: 'PARTIAL_MASK',
        showPrefix: 4,
        showSuffix: 3,
        maskChar: 'x',
      });

      expect(result).toBe('3201xxxxxxxxx001');
    });

    it('should mask dengan custom mask character', () => {
      const result = applyFieldMasking('3201010101010001', {
        strategy: 'PARTIAL_MASK',
        showPrefix: 4,
        showSuffix: 3,
        maskChar: '#',
      });

      expect(result).toBe('3201#########001');
    });

    it('should default maskChar ke x ketika tidak diberikan', () => {
      const result = applyFieldMasking('3201010101010001', {
        strategy: 'PARTIAL_MASK',
        showPrefix: 4,
        showSuffix: 3,
      });

      expect(result).toBe('3201xxxxxxxxx001');
    });

    it('should fallback ke full mask ketika value lebih pendek dari prefix+suffix', () => {
      const result = applyFieldMasking('1234', {
        strategy: 'PARTIAL_MASK',
        showPrefix: 4,
        showSuffix: 3,
        maskChar: 'x',
      });

      expect(result).toBe('xxxx');
    });

    it('should handle string kosong tanpa modifikasi', () => {
      expect(
        applyFieldMasking('', {
          strategy: 'PARTIAL_MASK',
          showPrefix: 4,
          showSuffix: 3,
        }),
      ).toBe('');
    });
  });

  describe('FULL_MASK strategy', () => {
    it('should mengganti seluruh value dengan replacement default ***', () => {
      expect(
        applyFieldMasking('rahasia', { strategy: 'FULL_MASK' }),
      ).toBe('***');
    });

    it('should mengganti dengan replacement kustom', () => {
      expect(
        applyFieldMasking('rahasia', {
          strategy: 'FULL_MASK',
          replacement: '[REDACTED]',
        }),
      ).toBe('[REDACTED]');
    });
  });

  describe('null/undefined handling', () => {
    it('should kembalikan null apa adanya', () => {
      expect(
        applyFieldMasking(null, { strategy: 'FULL_MASK' }),
      ).toBeNull();
    });

    it('should kembalikan undefined apa adanya', () => {
      expect(
        applyFieldMasking(undefined, { strategy: 'FULL_MASK' }),
      ).toBeUndefined();
    });
  });
});

describe('maskFieldValueForRole', () => {
  it('should masking NIK penduduk untuk role non-exempt (Sekretaris)', () => {
    const result = maskFieldValueForRole({
      objectNameSingular: 'penduduk',
      fieldName: 'nik',
      value: '3201010101010001',
      roleLabels: ['Sekretaris'],
    });

    expect(result).toBe('3201xxxxxxxxx001');
  });

  it('should tidak masking NIK untuk role Admin', () => {
    const result = maskFieldValueForRole({
      objectNameSingular: 'penduduk',
      fieldName: 'nik',
      value: '3201010101010001',
      roleLabels: ['Admin'],
    });

    expect(result).toBe('3201010101010001');
  });

  it('should tidak masking NIK untuk role Kepala Desa', () => {
    const result = maskFieldValueForRole({
      objectNameSingular: 'penduduk',
      fieldName: 'nik',
      value: '3201010101010001',
      roleLabels: ['Kepala Desa'],
    });

    expect(result).toBe('3201010101010001');
  });

  it('should masking NIK ketika user punya banyak role tapi tidak ada yang exempt', () => {
    const result = maskFieldValueForRole({
      objectNameSingular: 'penduduk',
      fieldName: 'nik',
      value: '3201010101010001',
      roleLabels: ['Staf', 'Sekretaris', 'Member'],
    });

    expect(result).toBe('3201xxxxxxxxx001');
  });

  it('should tidak masking NIK ketika user punya banyak role dan salah satunya exempt', () => {
    const result = maskFieldValueForRole({
      objectNameSingular: 'penduduk',
      fieldName: 'nik',
      value: '3201010101010001',
      roleLabels: ['Staf', 'Admin'],
    });

    expect(result).toBe('3201010101010001');
  });

  it('should tidak masking field yang tidak punya rule (mis. namaLengkap)', () => {
    const result = maskFieldValueForRole({
      objectNameSingular: 'penduduk',
      fieldName: 'namaLengkap',
      value: 'Budi Santoso',
      roleLabels: ['Sekretaris'],
    });

    expect(result).toBe('Budi Santoso');
  });

  it('should tidak masking object yang tidak punya rule (mis. keluarga.nomorKk)', () => {
    const result = maskFieldValueForRole({
      objectNameSingular: 'keluarga',
      fieldName: 'nomorKk',
      value: '3201010101010001',
      roleLabels: ['Sekretaris'],
    });

    expect(result).toBe('3201010101010001');
  });
});
