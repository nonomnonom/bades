import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const SURAT_MASUK_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor Agenda',
    name: 'nomorAgenda',
    icon: 'IconHash',
    description: 'Nomor agenda surat masuk (unik di buku agenda desa)',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Diterima',
    name: 'tanggalDiterima',
    icon: 'IconCalendarEvent',
    description: 'Tanggal surat diterima oleh desa',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor Surat',
    name: 'nomorSurat',
    icon: 'IconHash',
    description: 'Nomor surat asli dari instansi pengirim',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Surat',
    name: 'tanggalSurat',
    icon: 'IconCalendar',
    description: 'Tanggal surat dibuat oleh instansi pengirim',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Pengirim',
    name: 'pengirim',
    icon: 'IconBuilding',
    description: 'Nama instansi atau pihak pengirim surat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Perihal',
    name: 'perihal',
    icon: 'IconDescription',
    description: 'Perihal/subjek surat',
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
    label: 'Disposisi Ke',
    name: 'disposisiKe',
    icon: 'IconArrowForward',
    description: 'Pejabat atau bagian penerima disposisi',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    icon: 'IconNote',
    description: 'Catatan tambahan tentang surat masuk',
  },
];
