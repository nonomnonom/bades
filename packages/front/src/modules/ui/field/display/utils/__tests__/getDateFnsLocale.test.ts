import { getDateFnsLocale } from '@/ui/field/display/utils/getDateFnsLocale';

describe('getDateFnsLocale', () => {
  it('loads the Indonesian date-fns locale for id-ID', async () => {
    const locale = await getDateFnsLocale('id-ID');

    expect(locale).toBeDefined();
    expect(locale?.code).toBe('id');
  });
});
