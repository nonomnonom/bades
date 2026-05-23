import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const PERIODE_JABATAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Pejabat',
    name: 'namaPejabat',
    description: 'Nama orang yang menjabat pada periode ini',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Jabatan',
    name: 'namaJabatan',
    description: 'Nama jabatan yang diemban pada periode ini',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Mulai',
    name: 'tanggalMulai',
    description: 'Tanggal mulai menjabat',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Selesai',
    name: 'tanggalSelesai',
    description: 'Tanggal selesai menjabat (kosong jika masih aktif)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor SK',
    name: 'nomorSk',
    description: 'Nomor Surat Keputusan pengangkatan',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status Periode',
    name: 'statusPeriode',
    description: 'Status berjalannya periode jabatan',
    options: [
      { label: 'Aktif', value: 'AKTIF', position: 0, color: 'green' },
      { label: 'Selesai', value: 'SELESAI', position: 1, color: 'gray' },
      { label: 'Diberhentikan', value: 'DIBERHENTIKAN', position: 2, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Catatan tambahan tentang periode jabatan',
  },
];
