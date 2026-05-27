import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const JABATAN_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nama Jabatan',
    name: 'namaJabatan',
    description: 'Nama jabatan dalam pemerintahan desa',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Tipe Jabatan',
    name: 'tipeJabatan',
    description: 'Tipe jabatan',
    options: [
      { label: 'Kepala Desa', value: 'KEPALA_DESA', position: 0, color: 'red' },
      {
        label: 'Sekretaris Desa',
        value: 'SEKRETARIS',
        position: 1,
        color: 'blue',
      },
      { label: 'Kaur', value: 'KAUR', position: 2, color: 'green' },
      { label: 'Kasi', value: 'KASI', position: 3, color: 'yellow' },
      {
        label: 'Kepala Dusun',
        value: 'KEPALA_DUSUN',
        position: 4,
        color: 'purple',
      },
      { label: 'RT', value: 'RT', position: 5, color: 'orange' },
      { label: 'RW', value: 'RW', position: 6, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Tugas Pokok',
    name: 'tugasPokok',
    description: 'Tugas pokok jabatan',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Keterangan tambahan',
  },
  // Detail SK & periode jabatan (UU 6/2014 + Permendagri 67/2017)
  {
    type: FieldMetadataType.TEXT,
    label: 'NIPD',
    name: 'nipd',
    description: 'Nomor Induk Perangkat Desa',
    isUnique: true,
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor SK',
    name: 'nomorSk',
    description: 'Nomor Surat Keputusan pengangkatan jabatan',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal SK',
    name: 'tanggalSk',
    description: 'Tanggal terbit SK',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Mulai Jabatan',
    name: 'tanggalMulai',
    description: 'Tanggal mulai menjabat',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Tanggal Akhir Jabatan',
    name: 'tanggalAkhir',
    description: 'Tanggal akhir masa jabatan',
  },
  {
    type: FieldMetadataType.BOOLEAN,
    label: 'Status Aktif',
    name: 'statusAktif',
    description: 'Apakah jabatan masih aktif diemban',
  },
  {
    type: FieldMetadataType.UUID,
    label: 'ID Wilayah',
    name: 'wilayahId',
    description: 'Referensi ke wilayah (khusus Kepala Dusun / RT / RW)',
  },
  {
    type: FieldMetadataType.UUID,
    label: 'ID Penduduk',
    name: 'pendudukId',
    description: 'Referensi ke penduduk yang memegang jabatan ini (UU 6/2014)',
  },
];
