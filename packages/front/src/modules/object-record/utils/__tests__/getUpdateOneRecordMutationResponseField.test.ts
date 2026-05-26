import { getUpdateOneRecordMutationResponseField } from '@/object-record/utils/getUpdateOneRecordMutationResponseField';

describe('getUpdateOneRecordMutationResponseField', () => {
  it('should capitalize and prefix with "update"', () => {
    expect(getUpdateOneRecordMutationResponseField('penduduk')).toBe(
      'updatePenduduk',
    );
  });

  it('should handle multi-word object names', () => {
    expect(getUpdateOneRecordMutationResponseField('keluarga')).toBe(
      'updateKeluarga',
    );
  });

  it('should handle already capitalized names', () => {
    expect(getUpdateOneRecordMutationResponseField('Person')).toBe(
      'updatePenduduk',
    );
  });
});
