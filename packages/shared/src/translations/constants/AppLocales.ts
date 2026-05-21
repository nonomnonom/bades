import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';

export const APP_LOCALES = {
  'id-ID': 'id-ID',
  en: 'en',
} as const;

export type AppLocale = keyof typeof APP_LOCALES;
