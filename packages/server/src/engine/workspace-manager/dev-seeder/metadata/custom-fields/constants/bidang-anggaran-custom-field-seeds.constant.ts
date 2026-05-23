import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const BIDANG_ANGGARAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode',
    name: 'kode',
    icon: 'IconHash',
    description: 'Kode bidang anggaran APBDes (mis. 01, 02)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Bidang',
    name: 'namaBidang',
    icon: 'IconCategory',
    description: 'Nama bidang APBDes (Penyelenggaraan, Pelaksanaan, dst)',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Tahun Anggaran',
    name: 'tahunAnggaran',
    icon: 'IconCalendar',
    description: 'Tahun anggaran berjalan',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Pagu Anggaran',
    name: 'paguAnggaran',
    icon: 'IconCash',
    description: 'Pagu anggaran bidang dalam Rupiah',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    icon: 'IconNote',
    description: 'Catatan tambahan tentang bidang anggaran',
  },
];
