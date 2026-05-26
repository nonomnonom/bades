import { CoreObjectNameSingular } from 'shared/types';
import { isActivityTargetField } from '@/object-record/record-field-list/utils/categorizeRelationFields';

describe('isActivityTargetField', () => {
  it('should return true for noteTargets field on Note object', () => {
    expect(
      isActivityTargetField('noteTargets', CoreObjectNameSingular.Note),
    ).toBe(true);
  });

  it('should return true for taskTargets field on Task object', () => {
    expect(
      isActivityTargetField('taskTargets', CoreObjectNameSingular.Task),
    ).toBe(true);
  });

  it('should return false for noteTargets field on non-Note object', () => {
    expect(
      isActivityTargetField('noteTargets', CoreObjectNameSingular.Task),
    ).toBe(false);
  });

  it('should return false for taskTargets field on non-Task object', () => {
    expect(
      isActivityTargetField('taskTargets', CoreObjectNameSingular.Note),
    ).toBe(false);
  });

  it('should return false for regular field names', () => {
    expect(
      isActivityTargetField('keluarga', 'person'),
    ).toBe(false);
    expect(
      isActivityTargetField('penduduks', 'company'),
    ).toBe(false);
  });
});
