import { type Messages } from '@lingui/core';
import { createI18nInstanceFactory } from 'shared/i18n';
import { type APP_LOCALES } from 'shared/translations';
import { messages as enMessages } from '@/locales/generated/en';
import { messages as idMessages } from '@/locales/generated/id-ID';

const messages: Record<keyof typeof APP_LOCALES, Messages> = {
  en: enMessages,
  'id-ID': idMessages,
};

export const createI18nInstance = createI18nInstanceFactory(messages);
