import { CoreObjectNameSingular } from 'shared/types';

export const getEmptyStateSubTitle = (
  objectNameSingular: string,
  objectLabel: string,
) => {
  if (objectNameSingular === CoreObjectNameSingular.WorkflowVersion) {
    return `Buat alur kerja dan kembali ke sini untuk melihat versinya`;
  }

  if (objectNameSingular === CoreObjectNameSingular.WorkflowRun) {
    return `Jalankan alur kerja dan kembali ke sini untuk melihat eksekusinya`;
  }

  return `Tambahkan ${objectLabel} pertama Anda secara manual`;
};
