import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const PENERIMA_BANTUAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Penerima',
    name: 'namaPenerima',
    description: 'Nama penerima bantuan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'NIK',
    name: 'nik',
    description: 'Nomor Induk Kependudukan',
  },
  {
    type: FieldMetadataType.ADDRESS,
    label: 'Alamat',
    name: 'alamat',
    description: 'Alamat lengkap penerima bantuan',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status Penerimaan',
    name: 'statusPenerimaan',
    description: 'Status penerimaan',
    options: [
      {
        label: 'Terverifikasi',
        value: 'TERVERIFIKASI',
        position: 0,
        color: 'green',
      },
      { label: 'Menunggu', value: 'MENUNGGU', position: 1, color: 'yellow' },
      { label: 'Ditolak', value: 'DITOLAK', position: 2, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan',
  },
  // Detail penerimaan + bukti (junction Program Bantuan ↔ Penduduk/Keluarga)
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Terima',
    name: 'tanggalTerima',
    description: 'Tanggal bantuan diterima',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Jumlah Diterima',
    name: 'jumlahDiterima',
    description: 'Nominal bantuan yang diterima (Rupiah)',
  },
  {
    type: FieldMetadataType.LINKS,
    label: 'Bukti Terima',
    name: 'buktiTerima',
    description: 'Tautan bukti penerimaan (foto/scan dokumen)',
  },
  {
    type: FieldMetadataType.UUID,
    label: 'ID Program Bantuan',
    name: 'programBantuanId',
    description: 'Referensi ke Program Bantuan terkait',
  },
  {
    type: FieldMetadataType.UUID,
    label: 'ID Penduduk',
    name: 'pendudukId',
    description: 'Referensi ke Penduduk penerima',
  },
];
