import { createI18nInstanceFactory, type LocaleMessagesMap } from 'shared/i18n';
import { SOURCE_LOCALE } from 'shared/translations';
import { messages as idMessages } from '@/locales/generated/id-ID';

// Bades single-language: hanya katalog Bahasa Indonesia yang dimuat.
const messages: LocaleMessagesMap = {
  [SOURCE_LOCALE]: idMessages,
};

export const createI18nInstance = createI18nInstanceFactory(messages);
