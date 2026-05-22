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
    type: FieldMetadataType.TEXT,
    label: 'Alamat',
    name: 'alamat',
    description: 'Alamat penerima',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status Penerimaan',
    name: 'statusPenerimaan',
    description: 'Status penerimaan',
    options: [
      { label: 'Terverifikasi', value: 'TERVERIFIKASI', position: 0, color: 'green' },
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
];