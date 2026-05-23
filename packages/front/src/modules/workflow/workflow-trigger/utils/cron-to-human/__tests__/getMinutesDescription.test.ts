import { getMinutesDescription } from '@/workflow/workflow-trigger/utils/cron-to-human/descriptors/getMinutesDescription';
import { DEFAULT_CRON_DESCRIPTION_OPTIONS } from '@/workflow/workflow-trigger/utils/cron-to-human/types/cronDescriptionOptions';

describe('getMinutesDescription', () => {
  const options = DEFAULT_CRON_DESCRIPTION_OPTIONS;

  it('should handle wildcard', () => {
    expect(getMinutesDescription('*', options)).toBe('setiap menit');
  });

  it('should handle step values', () => {
    expect(getMinutesDescription('*/5', options)).toBe('setiap 5 menit');
    expect(getMinutesDescription('*/15', options)).toBe('setiap 15 menit');
    expect(getMinutesDescription('*/1', options)).toBe('setiap menit');
  });

  it('should handle range with step', () => {
    expect(getMinutesDescription('10-30/5', options)).toBe(
      'setiap 5 menit, antara menit ke-10 dan 30',
    );
  });

  it('should handle ranges', () => {
    expect(getMinutesDescription('10-20', options)).toBe(
      'antara menit ke-10 dan 20',
    );
    expect(getMinutesDescription('0-59', options)).toBe(
      'antara menit ke-0 dan 59',
    );
  });

  it('should handle lists', () => {
    expect(getMinutesDescription('10,20', options)).toBe(
      'pada menit 10 dan 20',
    );
    expect(getMinutesDescription('0,15,30,45', options)).toBe(
      'pada menit 0, 15, 30 dan 45',
    );
  });

  it('should handle single values', () => {
    expect(getMinutesDescription('0', options)).toBe('tepat di awal jam');
    expect(getMinutesDescription('1', options)).toBe(
      'pada menit ke-1 setiap jam',
    );
    expect(getMinutesDescription('30', options)).toBe(
      'pada menit ke-30 setiap jam',
    );
  });

  it('should handle edge cases', () => {
    expect(getMinutesDescription('', options)).toBe('');
    expect(getMinutesDescription('   ', options)).toBe('');
    expect(getMinutesDescription('invalid', options)).toBe('invalid');
  });
});
