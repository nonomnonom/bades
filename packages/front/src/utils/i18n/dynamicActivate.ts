import { i18n } from '@lingui/core';
import { type APP_LOCALES, SOURCE_LOCALE } from 'shared/translations';

/**
 * Bades dikunci single-language. Apa pun locale yang diminta pemanggil,
 * katalog yang diaktifkan selalu Bahasa Indonesia (`SOURCE_LOCALE`).
 * Parameter dipertahankan demi kompatibilitas pemanggil lama.
 */
export const dynamicActivate = async (
  _locale?: keyof typeof APP_LOCALES,
): Promise<void> => {
  const { messages } = await import(
    `../../locales/generated/${SOURCE_LOCALE}.ts`
  );
  i18n.load(SOURCE_LOCALE, messages);
  i18n.activate(SOURCE_LOCALE);
};
