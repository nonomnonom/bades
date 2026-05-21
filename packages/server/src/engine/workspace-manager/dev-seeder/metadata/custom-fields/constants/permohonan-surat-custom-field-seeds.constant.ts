import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const PERMOHONAN_SURAT_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor Permohonan',
    name: 'nomorPermohonan',
    icon: 'IconHash',
    description: 'Nomor registrasi permohonan',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Permohonan',
    name: 'tanggalPermohonan',
    icon: 'IconCalendar',
    description: 'Tanggal pengajuan permohonan',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    icon: 'IconStatusCheck',
    description: 'Status permohonan',
    options: [
      { label: 'Menunggu', value: 'MENUNGGU', position: 0, color: 'yellow' },
      { label: 'Diproses', value: 'DIPROSES', position: 1, color: 'blue' },
      { label: 'Selesai', value: 'SELESAI', position: 2, color: 'green' },
      { label: 'Ditolak', value: 'DITOLAK', position: 3, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keperluan',
    name: 'keperluan',
    icon: 'IconDescription',
    description: 'Keperluan surat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Catatan',
    name: 'catatan',
    icon: 'IconNote',
    description: 'Catatan/status lain',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Selesai',
    name: 'tanggalSelesai',
    icon: 'IconCalendar',
    description: 'Tanggal permohonan selesai',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Position',
    name: 'position',
    icon: 'IconHierarchy',
  },
];