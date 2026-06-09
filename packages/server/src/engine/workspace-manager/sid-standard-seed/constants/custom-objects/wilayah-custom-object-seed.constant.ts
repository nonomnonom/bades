import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/sid-standard-seed/constants/types/object-metadata-seed.type';

export const WILAYAH_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  labelPlural: 'Wilayah',
  labelSingular: 'Wilayah',
  namePlural: 'daftarWilayah',
  nameSingular: 'wilayah',
  icon: 'IconMapPin',
  description: 'Unit wilayah administratif desa (Dusun, RW, RT)',
  // namaWilayah adalah label domain wilayah (mis. "RT 001", "Dusun Krajan")
  labelIdentifierFieldName: 'namaWilayah',
};
