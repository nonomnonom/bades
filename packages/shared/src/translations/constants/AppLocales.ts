import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';

export const APP_LOCALES = {
  en: SOURCE_LOCALE,
  'id-ID': 'id-ID',
} as const;

export type AppLocale = keyof typeof APP_LOCALES;
