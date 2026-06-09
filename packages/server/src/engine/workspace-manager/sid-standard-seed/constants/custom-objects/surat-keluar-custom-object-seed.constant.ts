import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/sid-standard-seed/constants/types/object-metadata-seed.type';

export const SURAT_KELUAR_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  labelPlural: 'Surat',
  labelSingular: 'Surat',
  namePlural: 'daftarSuratKeluar',
  nameSingular: 'suratKeluar',
  icon: 'IconMail',
  description: 'Arsip surat masuk dan keluar desa',
  // nomorSurat adalah identifier unik arsip surat desa
  labelIdentifierFieldName: 'nomorSurat',
};
