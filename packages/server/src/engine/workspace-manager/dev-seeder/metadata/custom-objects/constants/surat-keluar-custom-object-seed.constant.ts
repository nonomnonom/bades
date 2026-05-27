import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/object-metadata-seed.type';

export const SURAT_KELUAR_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  // Label publik "Surat" per GOAL.md — object ini menampung surat masuk dan
  // keluar dalam satu tempat (dibedakan via field `arah_surat` saat reshape
  // field final). nameSingular tetap `suratKeluar` untuk kompatibilitas
  // table/relasi.
  labelPlural: 'Surat',
  labelSingular: 'Surat',
  namePlural: 'daftarSuratKeluar',
  nameSingular: 'suratKeluar',
  icon: 'IconMail',
  description: 'Arsip surat masuk dan keluar desa',
  // nomorSurat adalah identifier unik arsip surat desa
  labelIdentifierFieldName: 'nomorSurat',
};
