import {
  getEnglishLocaleName,
  getNativeLocaleName,
} from '../utils/locale-display-names';

describe('getNativeLocaleName', () => {
  it('returns the language name in its own language with the first character upper-cased', () => {
    expect(getNativeLocaleName('en')).toBe('English');
    expect(getNativeLocaleName('id-ID')).toBe('Indonesia');
  });

  it('does not return an empty string for the supported locales', () => {
    const value = getNativeLocaleName('id-ID');
    expect(value).not.toBe('');
    expect(value).not.toContain('(');
  });
});

describe('getEnglishLocaleName', () => {
  it('returns the English name for the language regardless of the input locale', () => {
    expect(getEnglishLocaleName('en')).toBe('English');
    expect(getEnglishLocaleName('id-ID')).toBe('Indonesian');
  });
});
