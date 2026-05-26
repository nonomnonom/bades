import { canOpenObjectInSidePanel } from '@/object-record/utils/canOpenObjectInSidePanel';

describe('canOpenObjectInSidePanel', () => {
  it('should return false for workflow objects', () => {
    expect(canOpenObjectInSidePanel('workflow')).toBe(false);
    expect(canOpenObjectInSidePanel('workflowVersion')).toBe(false);
    expect(canOpenObjectInSidePanel('dashboard')).toBe(false);
  });

  it('should return true for other objects', () => {
    expect(canOpenObjectInSidePanel('penduduk')).toBe(true);
    expect(canOpenObjectInSidePanel('keluarga')).toBe(true);
    expect(canOpenObjectInSidePanel('task')).toBe(true);
  });
});
