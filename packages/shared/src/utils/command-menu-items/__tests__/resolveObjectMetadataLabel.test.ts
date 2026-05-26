import { resolveObjectMetadataLabel } from '../resolveObjectMetadataLabel';

describe('resolveObjectMetadataLabel', () => {
  const objectMetadataItem = {
    labelSingular: 'penduduk',
    labelPlural: 'penduduks',
  };

  it('should return labelSingular when numberOfSelectedRecords is 1', () => {
    expect(
      resolveObjectMetadataLabel({
        objectMetadataItem,
        numberOfSelectedRecords: 1,
      }),
    ).toBe('penduduk');
  });

  it('should return labelPlural when numberOfSelectedRecords is 0', () => {
    expect(
      resolveObjectMetadataLabel({
        objectMetadataItem,
        numberOfSelectedRecords: 0,
      }),
    ).toBe('penduduks');
  });

  it('should return labelPlural when numberOfSelectedRecords is greater than 1', () => {
    expect(
      resolveObjectMetadataLabel({
        objectMetadataItem,
        numberOfSelectedRecords: 5,
      }),
    ).toBe('penduduks');
  });
});
