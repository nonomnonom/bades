import { getDateGranularityPluralLabel } from '@/side-panel/pages/page-layout/utils/getDateGranularityPluralLabel';
import { ObjectRecordGroupByDateGranularity } from 'shared/types';

describe('getDateGranularityPluralLabel', () => {
  it('returns "hari" for DAY granularity', () => {
    expect(
      getDateGranularityPluralLabel(ObjectRecordGroupByDateGranularity.DAY),
    ).toBe('hari');
  });

  it('returns "minggu" for WEEK granularity', () => {
    expect(
      getDateGranularityPluralLabel(ObjectRecordGroupByDateGranularity.WEEK),
    ).toBe('minggu');
  });

  it('returns "bulan" for MONTH granularity', () => {
    expect(
      getDateGranularityPluralLabel(ObjectRecordGroupByDateGranularity.MONTH),
    ).toBe('bulan');
  });

  it('returns "kuartal" for QUARTER granularity', () => {
    expect(
      getDateGranularityPluralLabel(ObjectRecordGroupByDateGranularity.QUARTER),
    ).toBe('kuartal');
  });

  it('returns "tahun" for YEAR granularity', () => {
    expect(
      getDateGranularityPluralLabel(ObjectRecordGroupByDateGranularity.YEAR),
    ).toBe('tahun');
  });

  it('returns "hari" for DAY_OF_THE_WEEK granularity', () => {
    expect(
      getDateGranularityPluralLabel(
        ObjectRecordGroupByDateGranularity.DAY_OF_THE_WEEK,
      ),
    ).toBe('hari');
  });

  it('returns "bulan" for MONTH_OF_THE_YEAR granularity', () => {
    expect(
      getDateGranularityPluralLabel(
        ObjectRecordGroupByDateGranularity.MONTH_OF_THE_YEAR,
      ),
    ).toBe('bulan');
  });

  it('returns "kuartal" for QUARTER_OF_THE_YEAR granularity', () => {
    expect(
      getDateGranularityPluralLabel(
        ObjectRecordGroupByDateGranularity.QUARTER_OF_THE_YEAR,
      ),
    ).toBe('kuartal');
  });

  it('returns "item" for NONE granularity', () => {
    expect(
      getDateGranularityPluralLabel(ObjectRecordGroupByDateGranularity.NONE),
    ).toBe('item');
  });
});
