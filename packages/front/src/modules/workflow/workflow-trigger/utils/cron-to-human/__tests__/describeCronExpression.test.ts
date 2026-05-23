import { describeCronExpression } from '@/workflow/workflow-trigger/utils/cron-to-human/describeCronExpression';

describe('describeCronExpression', () => {
  describe('basic expressions', () => {
    it('should describe setiap menit', () => {
      expect(describeCronExpression('* * * * *')).toBe('setiap menit');
    });

    it('should describe setiap 5 menit', () => {
      expect(describeCronExpression('*/5 * * * *')).toBe('setiap 5 menit');
    });

    it('should describe setiap jam', () => {
      expect(describeCronExpression('0 * * * *')).toBe('setiap jam');
    });

    it('should describe setiap 2 jam', () => {
      expect(describeCronExpression('0 */2 * * *')).toBe('setiap 2 jam');
    });

    it('should describe daily at specific time', () => {
      expect(describeCronExpression('30 14 * * *')).toBe('pukul 14:30 UTC');
    });

    it('should describe daily at midnight', () => {
      expect(describeCronExpression('0 0 * * *')).toBe('pukul 00:00 UTC');
    });
  });

  describe('day-specific expressions', () => {
    it('should describe every day', () => {
      expect(describeCronExpression('0 9 * * *')).toBe('pukul 09:00 UTC');
    });

    it('should describe setiap 3 hari', () => {
      expect(describeCronExpression('0 9 */3 * *')).toBe(
        'pukul 09:00 UTC setiap 3 hari',
      );
    });

    it('should describe weekdays', () => {
      expect(describeCronExpression('0 9 * * 1-5')).toBe(
        'pukul 09:00 UTC hanya hari kerja',
      );
    });

    it('should describe specific day of month', () => {
      expect(describeCronExpression('0 9 15 * *')).toBe(
        'pukul 09:00 UTC pada tanggal 15th bulan ini',
      );
    });

    it('should describe last day of month', () => {
      expect(describeCronExpression('0 9 L * *')).toBe(
        'pukul 09:00 UTC pada hari terakhir bulan ini',
      );
    });
  });

  describe('month-specific expressions', () => {
    it('should describe specific month', () => {
      expect(describeCronExpression('0 9 1 1 *')).toBe(
        'pukul 09:00 UTC pada tanggal 1th bulan ini hanya pada January',
      );
    });

    it('should describe multiple months', () => {
      expect(describeCronExpression('0 9 * 1,6,12 *')).toBe(
        'pukul 09:00 UTC hanya pada January, June dan December',
      );
    });

    it('should describe month range', () => {
      expect(describeCronExpression('0 9 * 6-8 *')).toBe(
        'pukul 09:00 UTC antara June dan August',
      );
    });

    it('should describe setiap 3 bulan', () => {
      expect(describeCronExpression('0 9 1 */3 *')).toBe(
        'pukul 09:00 UTC pada tanggal 1th bulan ini setiap 3 bulan',
      );
    });
  });

  describe('complex expressions', () => {
    it('should describe business hours setiap 15 menit hanya hari kerja', () => {
      expect(describeCronExpression('*/15 9-17 * * 1-5')).toBe(
        'setiap 15 menit antara 09:00 UTC dan 17:00 UTC hanya hari kerja',
      );
    });

    it('should describe first Monday of every month', () => {
      expect(describeCronExpression('0 9 * * 1#1')).toBe(
        'pukul 09:00 UTC pada Monday pertama bulan ini',
      );
    });

    it('should describe last Friday of every month', () => {
      expect(describeCronExpression('0 17 * * 5L')).toBe(
        'pukul 17:00 UTC pada Friday terakhir bulan ini',
      );
    });

    it('should describe multiple specific times', () => {
      expect(describeCronExpression('0 9,12,15 * * *')).toBe(
        'pukul 09:00 UTC, 12:00 UTC dan 15:00 UTC',
      );
    });

    it('should describe range of minutes', () => {
      expect(describeCronExpression('15-45 * * * *')).toBe(
        'antara menit ke-15 dan 45',
      );
    });

    it('should describe specific minutes on specific hours', () => {
      expect(describeCronExpression('30 9,14 * * *')).toBe(
        'pukul 09:30 UTC dan 14:30 UTC',
      );
    });
  });

  describe('real-world complex expressions', () => {
    it('should describe business hours setiap 15 menit hanya hari kerja', () => {
      expect(describeCronExpression('*/15 9-17 * * 1-5')).toBe(
        'setiap 15 menit antara 09:00 UTC dan 17:00 UTC hanya hari kerja',
      );
    });

    it('should describe quarterly reports', () => {
      expect(describeCronExpression('0 9 1 1,4,7,10 *')).toBe(
        'pukul 09:00 UTC pada tanggal 1th bulan ini hanya pada January, April, July dan October',
      );
    });

    it('should describe range of minutes', () => {
      expect(describeCronExpression('15-45 * * * *')).toBe(
        'antara menit ke-15 dan 45',
      );
    });

    it('should describe 4-field format expressions', () => {
      expect(describeCronExpression('9 * * *')).toBe('pukul 09:00 UTC');
      expect(describeCronExpression('*/2 * * *')).toBe('setiap 2 jam');
      expect(describeCronExpression('9 15 * *')).toBe(
        'pukul 09:00 UTC pada tanggal 15th bulan ini',
      );
      expect(describeCronExpression('9 * * 1')).toBe(
        'pukul 09:00 UTC hanya pada Monday',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty expression', () => {
      expect(() => describeCronExpression('')).toThrow(
        'Cron expression is required',
      );
    });

    it('should handle invalid expression', () => {
      expect(() => describeCronExpression('invalid')).toThrow(
        'Failed to describe cron expression',
      );
    });

    it('should handle expression with too many fields', () => {
      expect(() => describeCronExpression('0 0 0 0 0 0 0 0')).toThrow(
        'Failed to describe cron expression',
      );
    });
  });

  describe('12-hour format', () => {
    it('should use 12-hour format when specified', () => {
      expect(
        describeCronExpression('0 14 * * *', { use24HourTimeFormat: false }),
      ).toBe('pukul 2:00 PM UTC');
    });

    it('should use 12-hour format for multiple times', () => {
      expect(
        describeCronExpression('0 9,14,18 * * *', {
          use24HourTimeFormat: false,
        }),
      ).toBe('pukul 9:00 AM UTC, 2:00 PM UTC dan 6:00 PM UTC');
    });
  });
});
