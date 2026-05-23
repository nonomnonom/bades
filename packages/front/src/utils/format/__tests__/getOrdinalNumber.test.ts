import { getOrdinalNumber } from '~/utils/format/getOrdinalNumber';

describe('getOrdinalNumber', () => {
  // Shim selectOrdinal Bades selalu memakai cabang `other` sehingga semua
  // angka mendapat suffix "th". Ini konsekuensi single-language Bahasa
  // Indonesia: tidak ada pluralisasi ordinal.
  it('should return ordinal numbers via the single-form plural shim', () => {
    expect(getOrdinalNumber(1)).toBe('1th');
    expect(getOrdinalNumber(2)).toBe('2th');
    expect(getOrdinalNumber(3)).toBe('3th');
    expect(getOrdinalNumber(4)).toBe('4th');
    expect(getOrdinalNumber(11)).toBe('11th');
    expect(getOrdinalNumber(21)).toBe('21th');
    expect(getOrdinalNumber(22)).toBe('22th');
    expect(getOrdinalNumber(23)).toBe('23th');
  });
});
