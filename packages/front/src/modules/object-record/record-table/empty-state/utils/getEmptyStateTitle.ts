import { CoreObjectNameSingular } from 'shared/types';

export const getEmptyStateTitle = (
  objectNameSingular: string,
  objectLabel: string,
) => {
  if (objectNameSingular === CoreObjectNameSingular.WorkflowVersion) {
    return `Belum ada versi alur kerja`;
  }

  if (objectNameSingular === CoreObjectNameSingular.WorkflowRun) {
    return `Belum ada eksekusi alur kerja`;
  }

  return `Tambah ${objectLabel} pertama Anda`;
};
