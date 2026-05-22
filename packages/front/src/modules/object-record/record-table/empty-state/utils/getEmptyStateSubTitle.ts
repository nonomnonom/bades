import { CoreObjectNameSingular } from 'shared/types';
import { t } from '@lingui/core/macro';

export const getEmptyStateSubTitle = (
  objectNameSingular: string,
  objectLabel: string,
) => {
  if (objectNameSingular === CoreObjectNameSingular.WorkflowVersion) {
    return t`Buat alur kerja dan kembali ke sini untuk melihat versinya`;
  }

  if (objectNameSingular === CoreObjectNameSingular.WorkflowRun) {
    return t`Jalankan alur kerja dan kembali ke sini untuk melihat eksekusinya`;
  }

  return t`Tambahkan ${objectLabel} pertama Anda secara manual`;
};
