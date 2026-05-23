import { SOURCE_LOCALE } from '@/translations';
import { normalizeLocale } from '../normalizeLocale';

describe('normalizeLocale', () => {
  it('should return SOURCE_LOCALE when the input is null', () => {
    expect(normalizeLocale(null)).toBe(SOURCE_LOCALE);
  });

  it('should return the locale when there is a direct match in APP_LOCALES', () => {
    expect(normalizeLocale('id-ID')).toBe('id-ID');
  });

  it('should handle case-insensitive matches', () => {
    expect(normalizeLocale('id-id')).toBe('id-ID');
  });

  it('should match just the language part if full locale not found', () => {
    expect(normalizeLocale('id')).toBe('id-ID');
  });

  it('should return SOURCE_LOCALE for unsupported or invalid locales', () => {
    // Bades single-language: locale lain (termasuk 'en') jatuh ke SOURCE_LOCALE
    expect(normalizeLocale('en')).toBe(SOURCE_LOCALE);
    expect(normalizeLocale('invalid-locale')).toBe(SOURCE_LOCALE);
    expect(normalizeLocale('xx-XX')).toBe(SOURCE_LOCALE);
    expect(normalizeLocale('')).toBe(SOURCE_LOCALE);
  });

  it('should handle SOURCE_LOCALE correctly', () => {
    expect(normalizeLocale(SOURCE_LOCALE)).toBe(SOURCE_LOCALE);
  });
});
