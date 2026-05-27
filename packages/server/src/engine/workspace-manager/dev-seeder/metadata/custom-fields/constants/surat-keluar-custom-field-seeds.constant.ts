import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const SURAT_KELUAR_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.SELECT,
    label: 'Arah Surat',
    name: 'arahSurat',
    icon: 'IconArrowsExchange',
    description:
      'Apakah surat ini masuk dari instansi luar atau dikeluarkan oleh desa',
    options: [
      { label: 'Surat Keluar', value: 'KELUAR', position: 0, color: 'blue' },
      { label: 'Surat Masuk', value: 'MASUK', position: 1, color: 'green' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Asal Surat',
    name: 'asalSurat',
    icon: 'IconBuilding',
    description: 'Instansi atau orang yang mengirim surat (untuk surat masuk)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor Surat',
    name: 'nomorSurat',
    icon: 'IconHash',
    description: 'Nomor surat resmi yang dikeluarkan desa (unik)',
    isUnique: true,
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
    description: 'Tingkat kepentingan surat (Permendagri 47/2016)',
    options: [
      { label: 'Biasa', value: 'BIASA', position: 0, color: 'gray' },
      { label: 'Segera', value: 'SEGERA', position: 1, color: 'orange' },
      { label: 'Rahasia', value: 'RAHASIA', position: 2, color: 'red' },
      {
        label: 'Sangat Rahasia',
        value: 'SANGAT_RAHASIA',
        position: 3,
        color: 'pink',
      },
    ],
  },
  {
    type: FieldMetadataType.LINKS,
    label: 'File Lampiran',
    name: 'fileLampiran',
    icon: 'IconPaperclip',
    description: 'Tautan file lampiran surat',
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
    description: 'Catatan tambahan tentang surat',
  },
];
