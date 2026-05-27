import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/object-metadata-seed.type';

export const ASET_DESA_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  labelPlural: 'Aset Desa',
  labelSingular: 'Aset Desa',
  namePlural: 'daftarAsetDesa',
  nameSingular: 'asetDesa',
  icon: 'IconBuilding',
  description: 'Inventaris dan pengelolaan aset desa sesuai Permendagri 1/2016',
  // namaAset adalah representasi utama record aset desa
  labelIdentifierFieldName: 'namaAset',
};
