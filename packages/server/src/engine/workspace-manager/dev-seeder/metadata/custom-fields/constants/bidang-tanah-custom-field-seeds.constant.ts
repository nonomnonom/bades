import { FieldMetadataType } from 'shared/types';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const BIDANG_TANAH_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor Persil',
    name: 'nomorPersil',
    description: 'Nomor unik bidang tanah pada buku C desa atau registry persil',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Luas (m²)',
    name: 'luas',
    description: 'Luas bidang tanah dalam meter persegi',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Jenis Hak',
    name: 'jenisHak',
    description: 'Jenis hak atas tanah',
    options: [
      { label: 'Hak Milik', value: 'HM', position: 0, color: 'green' },
      { label: 'Hak Guna Bangunan', value: 'HGB', position: 1, color: 'blue' },
      { label: 'Hak Pakai', value: 'HP', position: 2, color: 'turquoise' },
      { label: 'Tanah Kas Desa', value: 'TANAH_KAS_DESA', position: 3, color: 'purple' },
      { label: 'Tanah Bengkok', value: 'TANAH_BENGKOK', position: 4, color: 'pink' },
      { label: 'Tanah Titisara', value: 'TANAH_TITISARA', position: 5, color: 'orange' },
      { label: 'Belum Bersertifikat', value: 'BELUM_BERSERTIFIKAT', position: 6, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Nomor Sertifikat',
    name: 'nomorSertifikat',
    description: 'Nomor sertifikat tanah dari BPN bila sudah bersertifikat',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Pemilik',
    name: 'pemilik',
    description: 'Nama pemilik bidang tanah atau "Pemerintah Desa" untuk tanah desa',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Alamat',
    name: 'alamat',
    description: 'Alamat atau lokasi bidang tanah',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Penggunaan',
    name: 'penggunaan',
    description: 'Peruntukan bidang tanah saat ini',
    options: [
      { label: 'Pemukiman', value: 'PEMUKIMAN', position: 0, color: 'blue' },
      { label: 'Pertanian', value: 'PERTANIAN', position: 1, color: 'green' },
      { label: 'Perkebunan', value: 'PERKEBUNAN', position: 2, color: 'turquoise' },
      { label: 'Fasilitas Umum', value: 'FASILITAS_UMUM', position: 3, color: 'purple' },
      { label: 'Komersial', value: 'KOMERSIAL', position: 4, color: 'orange' },
      { label: 'Tidak Digunakan', value: 'TIDAK_DIGUNAKAN', position: 5, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Keterangan',
    name: 'keterangan',
    description: 'Catatan tambahan tentang bidang tanah',
  },
];
