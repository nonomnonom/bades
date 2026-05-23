import { t } from '~/utils/i18n/badesI18n';
import { CoreObjectNameSingular } from 'shared/types';

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
