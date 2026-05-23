import { getHoursDescription } from '@/workflow/workflow-trigger/utils/cron-to-human/descriptors/getHoursDescription';
import { DEFAULT_CRON_DESCRIPTION_OPTIONS } from '@/workflow/workflow-trigger/utils/cron-to-human/types/cronDescriptionOptions';

describe('getHoursDescription', () => {
  const options24 = {
    ...DEFAULT_CRON_DESCRIPTION_OPTIONS,
    use24HourTimeFormat: true,
  };
  const options12 = {
    ...DEFAULT_CRON_DESCRIPTION_OPTIONS,
    use24HourTimeFormat: false,
  };

  describe('24-hour format', () => {
    it('should handle wildcard', () => {
      expect(getHoursDescription('*', '0', options24)).toBe('setiap jam');
    });

    it('should handle step values', () => {
      expect(getHoursDescription('*/2', '0', options24)).toBe('setiap 2 jam');
      expect(getHoursDescription('*/1', '0', options24)).toBe('setiap jam');
    });

    it('should handle range with step', () => {
      expect(getHoursDescription('9-17/2', '0', options24)).toBe(
        'setiap 2 jam, antara 09:00 UTC dan 17:00 UTC',
      );
    });

    it('should handle ranges', () => {
      expect(getHoursDescription('9-17', '0', options24)).toBe(
        'antara 09:00 UTC dan 17:00 UTC',
      );
    });

    it('should handle lists', () => {
      expect(getHoursDescription('9,12', '0', options24)).toBe(
        'pukul 09:00 UTC dan 12:00 UTC',
      );
      expect(getHoursDescription('9,12,15,18', '30', options24)).toBe(
        'pukul 09:30 UTC, 12:30 UTC, 15:30 UTC dan 18:30 UTC',
      );
    });

    it('should handle single values', () => {
      expect(getHoursDescription('9', '30', options24)).toBe('pukul 09:30 UTC');
      expect(getHoursDescription('0', '0', options24)).toBe('pukul 00:00 UTC');
      expect(getHoursDescription('23', '59', options24)).toBe(
        'pukul 23:59 UTC',
      );
    });
  });

  describe('12-hour format', () => {
    it('should format morning times', () => {
      expect(getHoursDescription('9', '30', options12)).toBe(
        'pukul 9:30 AM UTC',
      );
      expect(getHoursDescription('0', '0', options12)).toBe(
        'pukul 12:00 AM UTC',
      );
    });

    it('should format afternoon times', () => {
      expect(getHoursDescription('14', '30', options12)).toBe(
        'pukul 2:30 PM UTC',
      );
      expect(getHoursDescription('12', '0', options12)).toBe(
        'pukul 12:00 PM UTC',
      );
    });

    it('should format lists in 12-hour', () => {
      expect(getHoursDescription('9,14', '0', options12)).toBe(
        'pukul 9:00 AM UTC dan 2:00 PM UTC',
      );
    });

    it('should format ranges in 12-hour', () => {
      expect(getHoursDescription('9-17', '0', options12)).toBe(
        'antara 9:00 AM UTC dan 5:00 PM UTC',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty hours', () => {
      expect(getHoursDescription('', '0', options24)).toBe('');
    });

    it('should handle invalid hours', () => {
      expect(getHoursDescription('invalid', '0', options24)).toBe('invalid');
    });
  });
});
