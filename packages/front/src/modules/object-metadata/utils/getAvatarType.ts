import { CoreObjectNameSingular } from 'shared/types';

export const getAvatarType = (objectNameSingular: string) => {
  if (objectNameSingular === CoreObjectNameSingular.WorkspaceMember) {
    return 'rounded';
  }

  if (
    objectNameSingular === CoreObjectNameSingular.Task ||
    objectNameSingular === CoreObjectNameSingular.Note
  ) {
    return 'icon';
  }

  if (
    objectNameSingular === 'penduduk' ||
    objectNameSingular === 'keluarga' ||
    objectNameSingular === 'wilayah' ||
    objectNameSingular === 'asetDesa'
  ) {
    return 'rounded';
  }

  return 'rounded';
};
