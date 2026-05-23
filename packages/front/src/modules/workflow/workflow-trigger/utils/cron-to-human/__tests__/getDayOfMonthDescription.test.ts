import { getDayOfMonthDescription } from '@/workflow/workflow-trigger/utils/cron-to-human/descriptors/getDayOfMonthDescription';
import { DEFAULT_CRON_DESCRIPTION_OPTIONS } from '@/workflow/workflow-trigger/utils/cron-to-human/types/cronDescriptionOptions';

describe('getDayOfMonthDescription', () => {
  const options = DEFAULT_CRON_DESCRIPTION_OPTIONS;

  it('should handle wildcard (every day)', () => {
    expect(getDayOfMonthDescription('*', options)).toBe('setiap hari');
  });

  it('should handle last day of month', () => {
    expect(getDayOfMonthDescription('L', options)).toBe(
      'pada hari terakhir bulan ini',
    );
  });

  it('should handle single days', () => {
    expect(getDayOfMonthDescription('1', options)).toBe(
      'pada tanggal 1th bulan ini',
    );
    expect(getDayOfMonthDescription('2', options)).toBe(
      'pada tanggal 2th bulan ini',
    );
    expect(getDayOfMonthDescription('3', options)).toBe(
      'pada tanggal 3th bulan ini',
    );
    expect(getDayOfMonthDescription('15', options)).toBe(
      'pada tanggal 15th bulan ini',
    );
    expect(getDayOfMonthDescription('21', options)).toBe(
      'pada tanggal 21th bulan ini',
    );
    expect(getDayOfMonthDescription('22', options)).toBe(
      'pada tanggal 22th bulan ini',
    );
    expect(getDayOfMonthDescription('23', options)).toBe(
      'pada tanggal 23th bulan ini',
    );
    expect(getDayOfMonthDescription('31', options)).toBe(
      'pada tanggal 31th bulan ini',
    );
  });

  it('should handle step values', () => {
    expect(getDayOfMonthDescription('*/5', options)).toBe('setiap 5 hari');
    expect(getDayOfMonthDescription('*/1', options)).toBe('setiap hari');
    expect(getDayOfMonthDescription('*/10', options)).toBe('setiap 10 hari');
  });

  it('should handle range with step', () => {
    expect(getDayOfMonthDescription('1-15/3', options)).toBe(
      'setiap 3 hari, antara tanggal 1th dan 15th bulan ini',
    );
    expect(getDayOfMonthDescription('10-20/2', options)).toBe(
      'setiap 2 hari, antara tanggal 10th dan 20th bulan ini',
    );
  });

  it('should handle ranges', () => {
    expect(getDayOfMonthDescription('1-15', options)).toBe(
      'antara tanggal 1th dan 15th bulan ini',
    );
    expect(getDayOfMonthDescription('10-20', options)).toBe(
      'antara tanggal 10th dan 20th bulan ini',
    );
  });

  it('should handle lists', () => {
    expect(getDayOfMonthDescription('1,15', options)).toBe(
      'pada tanggal 1th dan 15th bulan ini',
    );
    expect(getDayOfMonthDescription('1,10,20,31', options)).toBe(
      'pada tanggal 1th, 10th, 20th dan 31th bulan ini',
    );
  });

  it('should handle weekday specifier', () => {
    expect(getDayOfMonthDescription('15W', options)).toBe(
      'pada hari kerja terdekat dengan tanggal 15th bulan ini',
    );
    expect(getDayOfMonthDescription('1W', options)).toBe(
      'pada hari kerja terdekat dengan tanggal 1th bulan ini',
    );
    expect(getDayOfMonthDescription('W', options)).toBe('hanya pada hari kerja');
  });

  it('should handle ordinal numbers via single-form plural shim', () => {
    // Shim selectOrdinal Bades single-language selalu pakai cabang `other`,
    // sehingga semua angka memakai suffix "th".
    expect(getDayOfMonthDescription('11', options)).toBe(
      'pada tanggal 11th bulan ini',
    );
    expect(getDayOfMonthDescription('12', options)).toBe(
      'pada tanggal 12th bulan ini',
    );
    expect(getDayOfMonthDescription('13', options)).toBe(
      'pada tanggal 13th bulan ini',
    );
  });

  it('should handle edge cases', () => {
    expect(getDayOfMonthDescription('', options)).toBe('');
    expect(getDayOfMonthDescription('   ', options)).toBe('');
    expect(getDayOfMonthDescription('invalid', options)).toBe('invalid');
  });
});
