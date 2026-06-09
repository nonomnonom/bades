import { type ObjectMetadataSeed } from 'src/engine/workspace-manager/sid-standard-seed/constants/types/object-metadata-seed.type';

export const PERMOHONAN_SURAT_CUSTOM_OBJECT_SEED: ObjectMetadataSeed = {
  labelPlural: 'Layanan',
  labelSingular: 'Layanan',
  namePlural: 'daftarPermohonanSurat',
  nameSingular: 'permohonanSurat',
  icon: 'IconClipboardList',
  description: 'Permohonan surat dan layanan administratif dari warga desa',
  // nomorPermohonan adalah identifier unik setiap permohonan layanan
  labelIdentifierFieldName: 'nomorPermohonan',
};
