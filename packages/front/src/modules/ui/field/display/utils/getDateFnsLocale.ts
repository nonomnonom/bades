import { type APP_LOCALES } from 'shared/translations';

type AppLocale = keyof typeof APP_LOCALES;
export const getDateFnsLocaleImport = (locale: AppLocale) => {
  // Bades single-language: selalu pakai locale tanggal Indonesia.
  switch (locale) {
    case 'id-ID':
      return import('date-fns/locale/id');
    default: {
      return import('date-fns/locale/id');
    }
  }
};

export const getDateFnsLocale = async (localeString?: string | null) => {
  return getDateFnsLocaleImport(localeString as AppLocale)
    .then((m) => m.default as unknown as Locale)
    .catch((_e) => undefined);
};
