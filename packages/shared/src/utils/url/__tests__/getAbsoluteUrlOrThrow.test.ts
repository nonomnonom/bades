import { getAbsoluteUrlOrThrow } from '@/utils/url/getAbsoluteUrlOrThrow';

describe('getAbsoluteUrlOrThrow', () => {
  it("returns the URL's hostname", () => {
    expect(getAbsoluteUrlOrThrow('https://www.example.com')).toBe(
      'https://www.example.com',
    );
  });

  it('returns an empty string for invalid URLs', () => {
    expect(() => getAbsoluteUrlOrThrow('?o')).toThrow('URL tidak valid');
    expect(() => getAbsoluteUrlOrThrow('')).toThrow('URL tidak valid');
    expect(() => getAbsoluteUrlOrThrow('\\')).toThrow('URL tidak valid');
    expect(() => getAbsoluteUrlOrThrow('2')).toThrow('URL tidak valid');
  });
});
