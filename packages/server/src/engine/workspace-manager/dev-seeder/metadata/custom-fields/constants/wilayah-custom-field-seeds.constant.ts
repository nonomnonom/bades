import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const WILAYAH_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Wilayah',
    name: 'namaWilayah',
    description: 'Nama wilayah administratif (mis. RT 001, RW 002, Dusun Krajan)',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Wilayah',
    name: 'jenisWilayah',
    description: 'Jenis unit wilayah administratif desa',
    options: [
      { label: 'Dusun', value: 'DUSUN', position: 0, color: 'purple' },
      { label: 'RW', value: 'RW', position: 1, color: 'blue' },
      { label: 'RT', value: 'RT', position: 2, color: 'green' },
      { label: 'Lingkungan', value: 'LINGKUNGAN', position: 3, color: 'orange' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode',
    name: 'kode',
    description: 'Kode wilayah (mis. 001, 002)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Catatan tambahan tentang wilayah',
  },
];
