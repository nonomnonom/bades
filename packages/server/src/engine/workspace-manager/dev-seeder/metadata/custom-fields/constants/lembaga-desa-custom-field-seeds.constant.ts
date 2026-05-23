import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const LEMBAGA_DESA_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Lembaga',
    name: 'namaLembaga',
    description: 'Nama lembaga desa',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Lembaga',
    name: 'jenisLembaga',
    description: 'Jenis lembaga desa',
    options: [
      { label: 'BPD', value: 'BPD', position: 0, color: 'blue' },
      { label: 'PKK', value: 'PKK', position: 1, color: 'red' },
      {
        label: 'Karang Taruna',
        value: 'KARANG_TARUNA',
        position: 2,
        color: 'green',
      },
      { label: 'LPM', value: 'LPM', position: 3, color: 'yellow' },
      { label: 'Posyandu', value: 'POSYANDU', position: 4, color: 'purple' },
      { label: 'Bumdes', value: 'BUMDES', position: 5, color: 'orange' },
      { label: 'Lainnya', value: 'LAINNYA', position: 6, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Alamat',
    name: 'alamat',
    description: 'Alamat kantor/tempat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Ketua',
    name: 'namaKetua',
    description: 'Nama ketua lembaga',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kontak',
    name: 'kontak',
    description: 'Nomor kontak',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan tambahan',
  },
];
