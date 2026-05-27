import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/object-metadata-seed.type';

export const PENERIMA_BANTUAN_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  labelPlural: 'Penerima Bantuan',
  labelSingular: 'Penerima Bantuan',
  namePlural: 'daftarPenerimaBantuan',
  nameSingular: 'penerimaBantuan',
  icon: 'IconHandHeart',
  description:
    'Data penerima program bantuan sosial — relasi Program Bantuan dengan Penduduk/Keluarga',
  // namaPenerima sebagai fallback label identifier (sebelum relasi RELATION penuh)
  labelIdentifierFieldName: 'namaPenerima',
};
