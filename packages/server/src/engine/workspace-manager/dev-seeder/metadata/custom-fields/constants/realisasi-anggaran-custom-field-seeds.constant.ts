import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const REALISASI_ANGGARAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Tahun Anggaran',
    name: 'tahunAnggaran',
    description: 'Tahun anggaran',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode Rekening',
    name: 'kodeRekening',
    description: 'Kode rekening',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Kegiatan',
    name: 'namaKegiatan',
    description: 'Nama kegiatan yang direalisasikan',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Volume',
    name: 'volume',
    description: 'Volume pekerjaan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Satuan',
    name: 'satuan',
    description: 'Satuan volume',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Anggaran',
    name: 'anggaran',
    description: 'Nilai anggaran',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Realisasi',
    name: 'realisasi',
    description: 'Nilai realiasi',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Sisa',
    name: 'sisa',
    description: 'Sisa anggaran',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Realisasi',
    name: 'tanggalRealisasi',
    description: 'Tanggal pelaksanaan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Position',
    name: 'position',
  },
];