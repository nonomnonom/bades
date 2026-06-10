import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/sid-standard-seed/constants/types/object-metadata-seed.type';

export const PENDUDUK_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  labelPlural: 'Penduduk',
  labelSingular: 'Penduduk',
  namePlural: 'daftarPenduduk',
  nameSingular: 'penduduk',
  icon: 'IconUser',
  description: 'Data warga terdaftar di desa sesuai Permendagri 109/2019',
  // namaLengkap (FULL_NAME) adalah representasi utama penduduk
  labelIdentifierFieldName: 'namaLengkap',
  // foto (FILES) dipakai sebagai avatar penduduk di search result dan record header
  imageIdentifierFieldName: 'foto',
};
