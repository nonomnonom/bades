import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const JENIS_SURAT_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode Surat',
    name: 'kodeSurat',
    icon: 'IconHash',
    description: 'Kode resmi surat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Surat',
    name: 'namaSurat',
    icon: 'IconFileText',
    description: 'Nama jenis surat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Deskripsi',
    name: 'deskripsi',
    icon: 'IconDescription',
    description: 'Deskripsi surat',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Kategori',
    name: 'kategori',
    icon: 'IconTag',
    description: 'Kategori surat',
    options: [
      { label: 'Kependudukan', value: 'KEPENDUDUKAN', position: 0, color: 'blue' },
      { label: 'Keterangan', value: 'KETERANGAN', position: 1, color: 'green' },
      { label: 'Izin', value: 'IZIN', position: 2, color: 'orange' },
      { label: 'Pengesahan', value: 'PENGESAHAN', position: 3, color: 'purple' },
      { label: 'Lainnya', value: 'LAINNYA', position: 4, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Biaya (Rp)',
    name: 'biaya',
    icon: 'IconMoney',
    description: 'Biaya pelayanan',
  },
  {
    type: FieldMetadataType.BOOLEAN,
    label: 'Aktif',
    name: 'isActive',
    icon: 'IconCheck',
    description: 'Apakah surat aktif',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Position',
    name: 'position',
    icon: 'IconHierarchy',
  },
];