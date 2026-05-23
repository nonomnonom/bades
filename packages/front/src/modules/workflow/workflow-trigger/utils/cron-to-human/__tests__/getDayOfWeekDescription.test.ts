import { getDayOfWeekDescription } from '@/workflow/workflow-trigger/utils/cron-to-human/descriptors/getDayOfWeekDescription';
import { DEFAULT_CRON_DESCRIPTION_OPTIONS } from '@/workflow/workflow-trigger/utils/cron-to-human/types/cronDescriptionOptions';

// Catatan: nama hari berasal dari date-fns tanpa locale, sehingga tetap dalam
// Bahasa Inggris di test ini. Wrapper Bahasa Indonesia ("hanya pada", "pada
// ... terakhir bulan ini") dikembalikan oleh shim i18n Bades.

describe('getDayOfWeekDescription', () => {
  const options = DEFAULT_CRON_DESCRIPTION_OPTIONS;

  it('should handle wildcard (every day)', () => {
    expect(getDayOfWeekDescription('*', options)).toBe('');
  });

  it('should handle single days', () => {
    expect(getDayOfWeekDescription('0', options)).toBe('hanya pada Sunday');
    expect(getDayOfWeekDescription('1', options)).toBe('hanya pada Monday');
    expect(getDayOfWeekDescription('6', options)).toBe('hanya pada Saturday');
    expect(getDayOfWeekDescription('7', options)).toBe('hanya pada Sunday');
  });

  it('should handle weekdays', () => {
    expect(getDayOfWeekDescription('1-5', options)).toBe('hanya hari kerja');
  });

  it('should handle weekends', () => {
    expect(getDayOfWeekDescription('0,6', options)).toBe(
      'hanya pada Sunday dan Saturday',
    );
  });

  it('should handle day ranges', () => {
    expect(getDayOfWeekDescription('1-3', options)).toBe(
      'dari Monday hingga Wednesday',
    );
    expect(getDayOfWeekDescription('4-6', options)).toBe(
      'dari Thursday hingga Saturday',
    );
  });

  it('should handle day lists', () => {
    expect(getDayOfWeekDescription('1,3,5', options)).toBe(
      'hanya pada Monday, Wednesday dan Friday',
    );
    expect(getDayOfWeekDescription('0,6', options)).toBe(
      'hanya pada Sunday dan Saturday',
    );
  });

  it('should handle step values', () => {
    expect(getDayOfWeekDescription('*/2', options)).toBe('setiap 2 hari');
    expect(getDayOfWeekDescription('*/1', options)).toBe('setiap hari');
  });

  it('should handle nth occurrence of weekday', () => {
    expect(getDayOfWeekDescription('1#1', options)).toBe(
      'pada Monday pertama bulan ini',
    );
    expect(getDayOfWeekDescription('5#2', options)).toBe(
      'pada Friday kedua bulan ini',
    );
    expect(getDayOfWeekDescription('0#3', options)).toBe(
      'pada Sunday ketiga bulan ini',
    );
  });

  it('should handle last occurrence of weekday', () => {
    expect(getDayOfWeekDescription('1L', options)).toBe(
      'pada Monday terakhir bulan ini',
    );
    expect(getDayOfWeekDescription('5L', options)).toBe(
      'pada Friday terakhir bulan ini',
    );
  });

  it('should handle different start index options', () => {
    const optionsStartFromOne = { ...options, dayOfWeekStartIndexZero: false };

    expect(getDayOfWeekDescription('2-6', optionsStartFromOne)).toBe(
      'hanya hari kerja',
    );
  });

  it('should handle edge cases', () => {
    expect(getDayOfWeekDescription('', options)).toBe('');
    expect(getDayOfWeekDescription('   ', options)).toBe('');
    expect(getDayOfWeekDescription('invalid', options)).toBe('invalid');
  });
});
