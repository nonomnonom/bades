import { getAggregateQueryName } from '@/object-record/utils/getAggregateQueryName';

describe('getAggregateQueryName', () => {
  it('should return the correct aggregate query name for a valid plural name', () => {
    expect(getAggregateQueryName('daftarProgramBantuan')).toBe(
      'AggregateDaftarProgramBantuan',
    );
    expect(getAggregateQueryName('daftarKeluarga')).toBe(
      'AggregateDaftarKeluarga',
    );
    expect(getAggregateQueryName('daftarPenduduk')).toBe(
      'AggregateDaftarPenduduk',
    );
  });

  it('should throw an error when input is undefined', () => {
    expect(() => getAggregateQueryName(undefined as any)).toThrow(
      'objectMetadataNamePlural is required',
    );
  });

  it('should throw an error when input is null', () => {
    expect(() => getAggregateQueryName(null as any)).toThrow(
      'objectMetadataNamePlural is required',
    );
  });
});
