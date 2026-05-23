import { CoreObjectNameSingular } from 'shared/types';
import { getEmptyStateSubTitle } from '@/object-record/record-table/empty-state/utils/getEmptyStateSubTitle';

describe('getEmptyStateSubTitle', () => {
  it('should return the correct sub title for workflow version', () => {
    const subTitle = getEmptyStateSubTitle(
      CoreObjectNameSingular.WorkflowVersion,
      'Workflow Version',
    );
    expect(subTitle).toBe(
      'Buat alur kerja dan kembali ke sini untuk melihat versinya',
    );
  });

  it('should return the correct sub title for workflow run', () => {
    const subTitle = getEmptyStateSubTitle(
      CoreObjectNameSingular.WorkflowRun,
      'Workflow Run',
    );
    expect(subTitle).toBe(
      'Jalankan alur kerja dan kembali ke sini untuk melihat eksekusinya',
    );
  });

  it('should return the correct sub title for other object', () => {
    const subTitle = getEmptyStateSubTitle('object', 'Object');
    expect(subTitle).toBe('Tambahkan Object pertama Anda secara manual');
  });
});
