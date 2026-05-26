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
    objectNameSingular === 'layanan' ||
    objectNameSingular === 'suratKeluar' ||
    objectNameSingular === 'programBantuan' ||
    objectNameSingular === 'penerimaBantuan' ||
    objectNameSingular === 'perangkatDesa' ||
    objectNameSingular === 'asetDesa'
  ) {
    return 'rounded';
  }

  return 'rounded';
};
