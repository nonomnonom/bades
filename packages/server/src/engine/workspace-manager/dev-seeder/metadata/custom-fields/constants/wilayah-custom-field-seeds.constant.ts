import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const WILAYAH_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Wilayah',
    name: 'namaWilayah',
    description:
      'Nama wilayah administratif (mis. RT 001, RW 002, Dusun Krajan)',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Wilayah',
    name: 'jenisWilayah',
    description: 'Jenis unit wilayah administratif desa',
    options: [
      { label: 'Dusun', value: 'DUSUN', position: 0, color: 'purple' },
      { label: 'RW', value: 'RW', position: 1, color: 'blue' },
      { label: 'RT', value: 'RT', position: 2, color: 'green' },
      {
        label: 'Lingkungan',
        value: 'LINGKUNGAN',
        position: 3,
        color: 'orange',
      },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Kode',
    name: 'kode',
    description: 'Kode wilayah (mis. 001, 002)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Catatan tambahan tentang wilayah',
  },
  // Hierarki & agregat wilayah desa (Permendagri 47/2016)
  {
    type: FieldMetadataType.UUID,
    label: 'Wilayah Induk',
    name: 'wilayahIndukId',
    description: 'Referensi ke wilayah induk untuk hierarki (RT → RW → Dusun)',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Kepala Wilayah',
    name: 'namaKepalaWilayah',
    description: 'Nama ketua/kepala wilayah (Kepala Dusun, Ketua RW/RT)',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah KK',
    name: 'jumlahKk',
    description: 'Agregat jumlah Kartu Keluarga di wilayah ini',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Jumlah Penduduk',
    name: 'jumlahPenduduk',
    description: 'Agregat jumlah penduduk di wilayah ini',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Luas (ha)',
    name: 'luasHektar',
    description: 'Luas wilayah dalam hektar',
  },
  {
    type: FieldMetadataType.RAW_JSON,
    label: 'Koordinat',
    name: 'koordinat',
    description: 'Koordinat batas wilayah dalam format GeoJSON',
  },
];
