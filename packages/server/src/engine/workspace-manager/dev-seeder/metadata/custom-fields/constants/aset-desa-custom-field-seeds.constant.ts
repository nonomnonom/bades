import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const ASET_DESA_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Aset',
    name: 'namaAset',
    description: 'Nama aset desa',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Aset',
    name: 'jenisAset',
    description: 'Jenis aset',
    options: [
      { label: 'Tanah', value: 'TANAH', position: 0 },
      { label: 'Bangunan', value: 'BANGUNAN', position: 1 },
      { label: 'Peralatan', value: 'PERALATAN', position: 2 },
      { label: 'Kendaraan', value: 'KENDARAAN', position: 3 },
      { label: 'Inventaris', value: 'INVENTARIS', position: 4 },
      { label: 'Lainnya', value: 'LAINNYA', position: 5 },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode Aset',
    name: 'kodeAset',
    description: 'Kode aset',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Lokasi',
    name: 'lokasi',
    description: 'Lokasi aset',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Nilai Aset',
    name: 'nilaiAset',
    description: 'Nilai aset dalam Rupiah',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Tahun Perolehan',
    name: 'tahunPerolehan',
    description: 'Tahun perolehan',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    description: 'Status aset',
    options: [
      { label: 'Bagus', value: 'BAGUS', position: 0 },
      { label: 'Rusak Ringan', value: 'RUSAK_RINGAN', position: 1 },
      { label: 'Rusak Berat', value: 'RUSAK_BERAT', position: 2 },
      { label: 'Dijual', value: 'DIJUAL', position: 3 },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan tambahan',
  },
];
