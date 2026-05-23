import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const KEGIATAN_ANGGARAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode',
    name: 'kode',
    icon: 'IconHash',
    description: 'Kode kegiatan anggaran (mis. 01.01.01)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Kegiatan',
    name: 'namaKegiatan',
    icon: 'IconClipboardList',
    description: 'Nama kegiatan/sub-kegiatan APBDes',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Bidang',
    name: 'namaBidang',
    icon: 'IconCategory',
    description: 'Nama bidang APBDes (denormalized untuk display)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Sumber Dana',
    name: 'namaSumberDana',
    icon: 'IconWallet',
    description: 'Nama sumber dana (denormalized untuk display)',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Pagu Kegiatan',
    name: 'paguKegiatan',
    icon: 'IconCash',
    description: 'Pagu kegiatan dalam Rupiah',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Tahun Anggaran',
    name: 'tahunAnggaran',
    icon: 'IconCalendar',
    description: 'Tahun anggaran berjalan',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    icon: 'IconStatusCheck',
    description: 'Status pelaksanaan kegiatan',
    options: [
      { label: 'Rencana', value: 'RENCANA', position: 0, color: 'gray' },
      {
        label: 'Pelaksanaan',
        value: 'PELAKSANAAN',
        position: 1,
        color: 'blue',
      },
      { label: 'Selesai', value: 'SELESAI', position: 2, color: 'green' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    icon: 'IconNote',
    description: 'Catatan tambahan tentang kegiatan anggaran',
  },
];
