import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const SURAT_KELUAR_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor Surat',
    name: 'nomorSurat',
    icon: 'IconHash',
    description: 'Nomor surat resmi yang dikeluarkan desa (unik)',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Surat',
    name: 'tanggalSurat',
    icon: 'IconCalendar',
    description: 'Tanggal surat dikeluarkan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Perihal',
    name: 'perihal',
    icon: 'IconDescription',
    description: 'Perihal/subjek surat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Tujuan',
    name: 'tujuan',
    icon: 'IconSend',
    description: 'Nama instansi atau penerima surat',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Klasifikasi',
    name: 'klasifikasi',
    icon: 'IconFlag',
    description: 'Tingkat kepentingan surat',
    options: [
      { label: 'Biasa', value: 'BIASA', position: 0, color: 'gray' },
      { label: 'Segera', value: 'SEGERA', position: 1, color: 'orange' },
      { label: 'Rahasia', value: 'RAHASIA', position: 2, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Penandatangan',
    name: 'penandatangan',
    icon: 'IconSignature',
    description: 'Nama pejabat penandatangan surat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    icon: 'IconNote',
    description: 'Catatan tambahan tentang surat keluar',
  },
];
