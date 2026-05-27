import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/object-metadata-seed.type';

export const JABATAN_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  // Label publik "Perangkat Desa" per GOAL.md (UU 6/2014 + Permendagri
  // 67/2017). nameSingular tetap `jabatan` untuk kompatibilitas table/relasi
  // pada workspace existing.
  labelPlural: 'Perangkat Desa',
  labelSingular: 'Perangkat Desa',
  namePlural: 'daftarJabatan',
  nameSingular: 'jabatan',
  icon: 'IconIdBadge',
  description: 'Perangkat desa yang sedang atau pernah menjabat',
  // namaJabatan adalah representasi utama record perangkat desa
  labelIdentifierFieldName: 'namaJabatan',
};
