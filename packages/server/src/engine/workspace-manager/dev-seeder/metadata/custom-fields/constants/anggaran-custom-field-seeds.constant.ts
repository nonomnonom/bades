import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const ANGGARAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Tahun Anggaran',
    name: 'tahunAnggaran',
    description: 'Tahun anggaran APBDes',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Anggaran',
    name: 'jenisAnggaran',
    description: 'Jenis anggaran',
    options: [
      { label: 'Pendapatan', value: 'PENDAPATAN', position: 0, color: 'green' },
      { label: 'Belanja', value: 'BELANJA', position: 1, color: 'red' },
      { label: 'Pembiayaan', value: 'PEMBIAYAAN', position: 2, color: 'blue' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode Rekening',
    name: 'kodeRekening',
    description: 'Kode rekening anggaran',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Anggaran',
    name: 'namaAnggaran',
    description: 'Nama/keterangan anggaran',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Anggaran',
    name: 'jumlahAnggaran',
    description: 'Jumlah anggaran dalam Rupiah',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Sumber Dana',
    name: 'sumberDana',
    description: 'Sumber dana',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan tambahan',
  },
];
