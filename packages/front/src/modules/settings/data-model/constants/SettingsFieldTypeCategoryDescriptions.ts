import { type SettingsFieldTypeCategoryType } from '@/settings/data-model/types/SettingsFieldTypeCategoryType';

export const SETTINGS_FIELD_TYPE_CATEGORY_DESCRIPTIONS: Record<
  SettingsFieldTypeCategoryType,
  string
> = {
  Basic: 'Semua tipe kolom dasar yang dibutuhkan untuk memulai',
  Advanced: 'Kolom lanjutan untuk kebutuhan yang lebih kompleks',
  Relation: 'Buat relasi dengan objek lain',
};
