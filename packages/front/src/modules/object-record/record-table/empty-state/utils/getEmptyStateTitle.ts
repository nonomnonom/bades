import { t } from '~/utils/i18n/badesI18n';
import { CoreObjectNameSingular } from 'shared/types';

export const getEmptyStateTitle = (
  objectNameSingular: string,
  objectLabel: string,
) => {
  if (objectNameSingular === CoreObjectNameSingular.WorkflowVersion) {
    return t`Belum ada versi alur kerja`;
  }

  if (objectNameSingular === CoreObjectNameSingular.WorkflowRun) {
    return t`Belum ada eksekusi alur kerja`;
  }

  return t`Tambah ${objectLabel} pertama Anda`;
};
