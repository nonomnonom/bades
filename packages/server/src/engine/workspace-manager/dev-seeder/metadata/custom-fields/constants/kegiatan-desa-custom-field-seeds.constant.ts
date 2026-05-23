import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const KEGIATAN_DESA_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Kegiatan',
    name: 'namaKegiatan',
    description: 'Nama kegiatan desa, misalnya Musrenbang Desa 2026',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Kegiatan',
    name: 'jenisKegiatan',
    description: 'Kategori umum kegiatan desa',
    options: [
      { label: 'Musrenbang', value: 'MUSRENBANG', position: 0, color: 'blue' },
      {
        label: 'Gotong Royong',
        value: 'GOTONG_ROYONG',
        position: 1,
        color: 'green',
      },
      { label: 'Hari Besar', value: 'HARI_BESAR', position: 2, color: 'red' },
      {
        label: 'Rapat Koordinasi',
        value: 'RAPAT_KOORDINASI',
        position: 3,
        color: 'purple',
      },
      {
        label: 'Penyuluhan',
        value: 'PENYULUHAN',
        position: 4,
        color: 'orange',
      },
      { label: 'Lainnya', value: 'LAINNYA', position: 5, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.DATE_TIME,
    label: 'Tanggal Kegiatan',
    name: 'tanggalKegiatan',
    description: 'Tanggal dan jam pelaksanaan kegiatan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Lokasi',
    name: 'lokasi',
    description: 'Tempat pelaksanaan kegiatan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Penanggung Jawab',
    name: 'penanggungJawab',
    description: 'Nama penanggung jawab kegiatan',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Peserta',
    name: 'jumlahPeserta',
    description: 'Perkiraan atau realisasi jumlah peserta kegiatan',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    description: 'Status pelaksanaan kegiatan',
    options: [
      {
        label: 'Direncanakan',
        value: 'DIRENCANAKAN',
        position: 0,
        color: 'gray',
      },
      {
        label: 'Berlangsung',
        value: 'BERLANGSUNG',
        position: 1,
        color: 'blue',
      },
      { label: 'Selesai', value: 'SELESAI', position: 2, color: 'green' },
      { label: 'Dibatalkan', value: 'DIBATALKAN', position: 3, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Catatan tambahan tentang kegiatan',
  },
];
