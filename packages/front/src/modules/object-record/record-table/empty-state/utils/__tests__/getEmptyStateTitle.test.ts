import { CoreObjectNameSingular } from 'shared/types';
import { getEmptyStateTitle } from '@/object-record/record-table/empty-state/utils/getEmptyStateTitle';

describe('getEmptyStateTitle', () => {
  it('should return the correct title for workflow version', () => {
    const title = getEmptyStateTitle(
      CoreObjectNameSingular.WorkflowVersion,
      'Workflow Version',
    );
    expect(title).toBe('Belum ada versi alur kerja');
  });

  it('should return the correct title for workflow run', () => {
    const title = getEmptyStateTitle(
      CoreObjectNameSingular.WorkflowRun,
      'Workflow Run',
    );
    expect(title).toBe('Belum ada eksekusi alur kerja');
  });

  it('should return the correct title for other object', () => {
    const title = getEmptyStateTitle('object', 'Object');
    expect(title).toBe('Tambah Object pertama Anda');
  });
});
