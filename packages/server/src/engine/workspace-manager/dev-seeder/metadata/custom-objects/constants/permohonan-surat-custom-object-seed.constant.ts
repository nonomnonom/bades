import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/object-metadata-seed.type';

export const PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  // Label publik "Layanan" per GOAL.md (permohonan surat oleh warga).
  // nameSingular tetap `permohonanSurat` agar table/relasi yang sudah
  // ada di workspace existing tidak ikut migrasi.
  labelPlural: 'Layanan',
  labelSingular: 'Layanan',
  namePlural: 'daftarPermohonanSurat',
  nameSingular: 'permohonanSurat',
  icon: 'IconClipboardList',
  description: 'Permohonan surat dan layanan administratif dari warga desa',
  // nomorPermohonan adalah identifier unik setiap permohonan layanan
  labelIdentifierFieldName: 'nomorPermohonan',
};
