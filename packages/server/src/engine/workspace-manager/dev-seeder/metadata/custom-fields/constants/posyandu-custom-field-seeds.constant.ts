import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const POSYANDU_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Posyandu',
    name: 'namaPosyandu',
    description: 'Nama unit Posyandu di wilayah desa',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kader',
    name: 'kader',
    description: 'Nama kader atau koordinator Posyandu',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Jadwal Rutin',
    name: 'jadwalRutin',
    description: 'Jadwal pelaksanaan Posyandu, misalnya setiap Selasa pekan ke-2',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Lokasi',
    name: 'lokasi',
    description: 'Tempat pelaksanaan kegiatan Posyandu',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Balita',
    name: 'jumlahBalita',
    description: 'Jumlah balita yang terdaftar pada Posyandu',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Ibu Hamil',
    name: 'jumlahIbuHamil',
    description: 'Jumlah ibu hamil yang terdata di Posyandu',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Lansia',
    name: 'jumlahLansia',
    description: 'Jumlah lansia yang dilayani Posyandu',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Catatan tambahan tentang Posyandu',
  },
];
