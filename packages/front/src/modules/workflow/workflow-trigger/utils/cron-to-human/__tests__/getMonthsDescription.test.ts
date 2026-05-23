import { getMonthsDescription } from '@/workflow/workflow-trigger/utils/cron-to-human/descriptors/getMonthsDescription';
import { DEFAULT_CRON_DESCRIPTION_OPTIONS } from '@/workflow/workflow-trigger/utils/cron-to-human/types/cronDescriptionOptions';

// Nama bulan tetap berasal dari date-fns tanpa locale, jadi muncul dalam
// Bahasa Inggris. Wrapper kata depan ("hanya pada", "antara", "setiap N
// bulan") sudah diterjemahkan ke Bahasa Indonesia oleh shim i18n.

describe('getMonthsDescription', () => {
  const options = DEFAULT_CRON_DESCRIPTION_OPTIONS;

  it('should handle wildcard (every month)', () => {
    expect(getMonthsDescription('*', options)).toBe('');
  });

  it('should handle single months', () => {
    expect(getMonthsDescription('1', options)).toBe('hanya pada January');
    expect(getMonthsDescription('6', options)).toBe('hanya pada June');
    expect(getMonthsDescription('12', options)).toBe('hanya pada December');
  });

  it('should handle step values', () => {
    expect(getMonthsDescription('*/3', options)).toBe('setiap 3 bulan');
    expect(getMonthsDescription('*/6', options)).toBe('setiap 6 bulan');
    expect(getMonthsDescription('*/1', options)).toBe('');
  });

  it('should handle range with step', () => {
    expect(getMonthsDescription('1-6/2', options)).toBe(
      'setiap 2 bulan, antara January dan June',
    );
    expect(getMonthsDescription('3-9/3', options)).toBe(
      'setiap 3 bulan, antara March dan September',
    );
  });

  it('should handle ranges', () => {
    expect(getMonthsDescription('1-6', options)).toBe(
      'antara January dan June',
    );
    expect(getMonthsDescription('6-8', options)).toBe('antara June dan August');
  });

  it('should handle lists', () => {
    expect(getMonthsDescription('1,6', options)).toBe(
      'hanya pada January dan June',
    );
    expect(getMonthsDescription('1,6,12', options)).toBe(
      'hanya pada January, June dan December',
    );
    expect(getMonthsDescription('3,6,9,12', options)).toBe(
      'hanya pada March, June, September dan December',
    );
  });

  it('should handle month start index options', () => {
    const optionsZeroIndex = { ...options, monthStartIndexZero: true };

    expect(getMonthsDescription('0', optionsZeroIndex)).toBe(
      'hanya pada January',
    );
    expect(getMonthsDescription('11', optionsZeroIndex)).toBe(
      'hanya pada December',
    );
  });

  it('should handle edge cases', () => {
    expect(getMonthsDescription('', options)).toBe('');
    expect(getMonthsDescription('   ', options)).toBe('');
    expect(getMonthsDescription('invalid', options)).toBe('invalid');
  });

  describe('with locale catalog', () => {
    it('should handle locale catalog without crashing', () => {
      const mockLocale = {
        localize: {
          month: () => 'MockMonth',
        },
        formatLong: {
          date: () => 'P',
          time: () => 'p',
          dateTime: () => 'Pp',
        },
      } as any;
      expect(() =>
        getMonthsDescription('1', options, mockLocale),
      ).not.toThrow();
    });
  });
});
