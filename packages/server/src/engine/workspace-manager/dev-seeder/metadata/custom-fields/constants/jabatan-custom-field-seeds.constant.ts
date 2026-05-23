import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const JABATAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Jabatan',
    name: 'namaJabatan',
    description: 'Nama jabatan dalam pemerintahan desa',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Tipe Jabatan',
    name: 'tipeJabatan',
    description: 'Tipe jabatan',
    options: [
      { label: 'Kepala Desa', value: 'KEPALA_DESA', position: 0, color: 'red' },
      {
        label: 'Sekretaris Desa',
        value: 'SEKRETARIS',
        position: 1,
        color: 'blue',
      },
      { label: 'Kaur', value: 'KAUR', position: 2, color: 'green' },
      { label: 'Kasi', value: 'KASI', position: 3, color: 'yellow' },
      {
        label: 'Kepala Dusun',
        value: 'KEPALA_DUSUN',
        position: 4,
        color: 'purple',
      },
      { label: 'RT', value: 'RT', position: 5, color: 'orange' },
      { label: 'RW', value: 'RW', position: 6, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Tugas Pokok',
    name: 'tugasPokok',
    description: 'Tugas pokok jabatan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan tambahan',
  },
];
