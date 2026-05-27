import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const PROGRAM_BANTUAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Program',
    name: 'namaProgram',
    description: 'Nama program bantuan',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Bantuan',
    name: 'jenisBantuan',
    description: 'Jenis bantuan',
    options: [
      { label: 'BLT', value: 'BLT', position: 0, color: 'red' },
      { label: 'BPNT', value: 'BPNT', position: 1, color: 'orange' },
      { label: 'PKH', value: 'PKH', position: 2, color: 'yellow' },
      { label: 'BST', value: 'BST', position: 3, color: 'green' },
      { label: 'Kemensos', value: 'KEMENSOS', position: 4, color: 'blue' },
      { label: 'Daerah', value: 'DAERAH', position: 5, color: 'purple' },
      { label: 'Lainnya', value: 'LAINNYA', position: 6, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Sumber Dana',
    name: 'sumberDana',
    description: 'Sumber dana bantuan',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Penerima',
    name: 'jumlahPenerima',
    description: 'Jumlah penerima bantuan',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Nilai Per Orang',
    name: 'nilaiPerOrang',
    description: 'Nilai bantuan per orang (Rupiah)',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Mulai',
    name: 'tanggalMulai',
    description: 'Tanggal mulai program',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Selesai',
    name: 'tanggalSelesai',
    description: 'Tanggal selesai program',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    description: 'Status program',
    options: [
      {
        label: 'Perencanaan',
        value: 'PERENCANAAN',
        position: 0,
        color: 'gray',
      },
      {
        label: 'Pelaksanaan',
        value: 'PELAKSANAAN',
        position: 1,
        color: 'blue',
      },
      { label: 'Selesai', value: 'SELESAI', position: 2, color: 'green' },
      { label: 'Dibatalkan', value: 'DIBATALKAN', position: 3, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Total Anggaran',
    name: 'totalAnggaran',
    description: 'Total anggaran program (Rupiah)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan tambahan',
  },
];
