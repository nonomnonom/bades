import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { DEFAULT_NOTE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultNoteRecordPageLayoutId';
import { DEFAULT_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultRecordPageLayoutId';
import { DEFAULT_TASK_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultTaskRecordPageLayoutId';
import { getRecordPageLayoutId } from '@/page-layout/utils/getRecordPageLayoutId';
import { CoreObjectNameSingular } from 'shared/types';

const createMockRecord = (
  overrides: Partial<ObjectRecord> = {},
): ObjectRecord => ({
  id: 'record-1',
  __typename: 'ObjectRecord',
  ...overrides,
});

describe('getRecordPageLayoutId', () => {
  it('should return null when record is null', () => {
    const result = getRecordPageLayoutId({
      record: null,
      targetObjectNameSingular: CoreObjectNameSingular.Note,
    });

    expect(result).toBeNull();
  });

  it('should return null when record is undefined', () => {
    const result = getRecordPageLayoutId({
      record: undefined,
      targetObjectNameSingular: CoreObjectNameSingular.Note,
    });

    expect(result).toBeNull();
  });

  it('should return record.pageLayoutId when it is defined', () => {
    const record = createMockRecord({ pageLayoutId: 'custom-layout-123' });

    const result = getRecordPageLayoutId({
      record,
      targetObjectNameSingular: CoreObjectNameSingular.Note,
    });

    expect(result).toBe('custom-layout-123');
  });

  it('should return Note default layout for Note object', () => {
    const record = createMockRecord();

    const result = getRecordPageLayoutId({
      record,
      targetObjectNameSingular: CoreObjectNameSingular.Note,
    });

    expect(result).toBe(DEFAULT_NOTE_RECORD_PAGE_LAYOUT_ID);
  });

  it('should return Task default layout for Task object', () => {
    const record = createMockRecord();

    const result = getRecordPageLayoutId({
      record,
      targetObjectNameSingular: CoreObjectNameSingular.Task,
    });

    expect(result).toBe(DEFAULT_TASK_RECORD_PAGE_LAYOUT_ID);
  });

  it('should return generic default layout for SID custom object (penduduk)', () => {
    const record = createMockRecord();

    const result = getRecordPageLayoutId({
      record,
      targetObjectNameSingular: 'penduduk',
    });

    expect(result).toBe(DEFAULT_RECORD_PAGE_LAYOUT_ID);
  });

  it('should return generic default layout for unknown object type', () => {
    const record = createMockRecord();

    const result = getRecordPageLayoutId({
      record,
      targetObjectNameSingular: 'customObject',
    });

    expect(result).toBe(DEFAULT_RECORD_PAGE_LAYOUT_ID);
  });
});
