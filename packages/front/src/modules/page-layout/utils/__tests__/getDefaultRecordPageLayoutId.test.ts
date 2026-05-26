import { CoreObjectNameSingular } from 'shared/types';
import { DEFAULT_NOTE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultNoteRecordPageLayoutId';
import { DEFAULT_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultRecordPageLayoutId';
import { DEFAULT_TASK_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultTaskRecordPageLayoutId';
import { DEFAULT_WORKFLOW_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowPageLayoutId';
import { DEFAULT_WORKFLOW_RUN_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowRunPageLayoutId';
import { DEFAULT_WORKFLOW_VERSION_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowVersionPageLayoutId';
import { getDefaultRecordPageLayoutId } from '@/page-layout/utils/getDefaultRecordPageLayoutId';

describe('getDefaultRecordPageLayoutId', () => {
  it('should return Note layout id for Note object', () => {
    expect(
      getDefaultRecordPageLayoutId({
        targetObjectNameSingular: CoreObjectNameSingular.Note,
      }),
    ).toBe(DEFAULT_NOTE_RECORD_PAGE_LAYOUT_ID);
  });

  it('should return Task layout id for Task object', () => {
    expect(
      getDefaultRecordPageLayoutId({
        targetObjectNameSingular: CoreObjectNameSingular.Task,
      }),
    ).toBe(DEFAULT_TASK_RECORD_PAGE_LAYOUT_ID);
  });

  it('should return Workflow layout id for Workflow object', () => {
    expect(
      getDefaultRecordPageLayoutId({
        targetObjectNameSingular: CoreObjectNameSingular.Workflow,
      }),
    ).toBe(DEFAULT_WORKFLOW_PAGE_LAYOUT_ID);
  });

  it('should return WorkflowVersion layout id for WorkflowVersion object', () => {
    expect(
      getDefaultRecordPageLayoutId({
        targetObjectNameSingular: CoreObjectNameSingular.WorkflowVersion,
      }),
    ).toBe(DEFAULT_WORKFLOW_VERSION_PAGE_LAYOUT_ID);
  });

  it('should return WorkflowRun layout id for WorkflowRun object', () => {
    expect(
      getDefaultRecordPageLayoutId({
        targetObjectNameSingular: CoreObjectNameSingular.WorkflowRun,
      }),
    ).toBe(DEFAULT_WORKFLOW_RUN_PAGE_LAYOUT_ID);
  });

  it('should return default record page layout id for SID custom object (penduduk)', () => {
    expect(
      getDefaultRecordPageLayoutId({
        targetObjectNameSingular: 'penduduk',
      }),
    ).toBe(DEFAULT_RECORD_PAGE_LAYOUT_ID);
  });

  it('should return default record page layout id for unknown object', () => {
    expect(
      getDefaultRecordPageLayoutId({
        targetObjectNameSingular: 'customObject',
      }),
    ).toBe(DEFAULT_RECORD_PAGE_LAYOUT_ID);
  });
});
