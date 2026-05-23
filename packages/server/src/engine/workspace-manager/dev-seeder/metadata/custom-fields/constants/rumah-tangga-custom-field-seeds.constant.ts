import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const RUMAH_TANGGA_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor Rumah Tangga',
    name: 'nomorRumahTangga',
    description: 'Nomor identifikasi unik rumah tangga di desa',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Kepala Rumah Tangga',
    name: 'namaKepalaRumahTangga',
    description: 'Nama kepala rumah tangga',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Alamat',
    name: 'alamat',
    description: 'Alamat tempat tinggal rumah tangga',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Anggota',
    name: 'jumlahAnggota',
    description: 'Jumlah anggota yang tinggal dalam satu rumah tangga',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status Ekonomi',
    name: 'statusEkonomi',
    description: 'Klasifikasi tingkat kesejahteraan rumah tangga',
    options: [
      {
        label: 'Pra Sejahtera',
        value: 'PRA_SEJAHTERA',
        position: 0,
        color: 'red',
      },
      {
        label: 'Sejahtera I',
        value: 'SEJAHTERA_I',
        position: 1,
        color: 'orange',
      },
      {
        label: 'Sejahtera II',
        value: 'SEJAHTERA_II',
        position: 2,
        color: 'yellow',
      },
      {
        label: 'Sejahtera III',
        value: 'SEJAHTERA_III',
        position: 3,
        color: 'green',
      },
      {
        label: 'Sejahtera III Plus',
        value: 'SEJAHTERA_III_PLUS',
        position: 4,
        color: 'blue',
      },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Catatan tambahan tentang rumah tangga',
  },
];
