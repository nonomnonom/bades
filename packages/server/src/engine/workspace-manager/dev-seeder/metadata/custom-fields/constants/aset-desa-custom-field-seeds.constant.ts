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
  // Detail pengelolaan aset (Permendagri 1/2016 Pengelolaan Aset Desa)
  {
    type: FieldMetadataType.SELECT,
    label: 'Kategori Aset',
    name: 'kategoriAset',
    description: 'Kategori berdasarkan sifat aset',
    options: [
      { label: 'Bergerak', value: 'BERGERAK', position: 0, color: 'blue' },
      {
        label: 'Tidak Bergerak',
        value: 'TIDAK_BERGERAK',
        position: 1,
        color: 'turquoise',
      },
      {
        label: 'Tak Berwujud',
        value: 'TAK_BERWUJUD',
        position: 2,
        color: 'purple',
      },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Asal Perolehan',
    name: 'asalPerolehan',
    description: 'Sumber perolehan aset',
    options: [
      { label: 'APBDes', value: 'APBDES', position: 0, color: 'green' },
      { label: 'Hibah', value: 'HIBAH', position: 1, color: 'sky' },
      {
        label: 'Bantuan Pemerintah',
        value: 'BANTUAN_PEMERINTAH',
        position: 2,
        color: 'blue',
      },
      { label: 'Pembelian', value: 'PEMBELIAN', position: 3, color: 'yellow' },
      { label: 'Lainnya', value: 'LAINNYA', position: 4, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Nilai Buku',
    name: 'nilaiBuku',
    description: 'Nilai buku aset setelah penyusutan (Rupiah)',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Kondisi',
    name: 'kondisi',
    description: 'Kondisi fisik aset saat ini',
    options: [
      { label: 'Baik', value: 'BAIK', position: 0, color: 'green' },
      {
        label: 'Rusak Ringan',
        value: 'RUSAK_RINGAN',
        position: 1,
        color: 'yellow',
      },
      { label: 'Rusak Berat', value: 'RUSAK_BERAT', position: 2, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Bukti Kepemilikan',
    name: 'buktiKepemilikan',
    description: 'Nomor sertifikat, BPKB, atau dokumen kepemilikan lain',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Penanggung Jawab',
    name: 'penanggungJawab',
    description: 'Nama perangkat desa penanggung jawab aset',
  },
  {
    type: FieldMetadataType.LINKS,
    label: 'Foto Aset',
    name: 'fotoAset',
    description: 'Tautan foto aset',
  },
];
