import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';

// Bades adalah produk single-language: hanya Bahasa Indonesia (`id-ID`).
export const APP_LOCALES = {
  [SOURCE_LOCALE]: SOURCE_LOCALE,
} as const;

export type AppLocale = keyof typeof APP_LOCALES;
