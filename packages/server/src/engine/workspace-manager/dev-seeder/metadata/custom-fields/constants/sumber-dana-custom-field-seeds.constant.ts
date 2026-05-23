import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const SUMBER_DANA_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode',
    name: 'kode',
    icon: 'IconHash',
    description: 'Kode singkat sumber dana (DD, ADD, PAD, BPROV, BKAB)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Sumber',
    name: 'namaSumber',
    icon: 'IconWallet',
    description: 'Nama sumber dana APBDes',
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
    label: 'Pagu',
    name: 'pagu',
    icon: 'IconCash',
    description: 'Pagu dana yang tersedia dalam Rupiah',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    icon: 'IconNote',
    description: 'Catatan tambahan tentang sumber dana',
  },
];
