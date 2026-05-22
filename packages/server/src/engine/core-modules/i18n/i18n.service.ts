import { Injectable, type OnModuleInit } from '@nestjs/common';

import {
  type I18n,
  type MessageOptions,
  type Messages,
  setupI18n,
} from '@lingui/core';
import { type APP_LOCALES, SOURCE_LOCALE } from 'shared/translations';

import { messages as idMessages } from 'src/engine/core-modules/i18n/locales/generated/id-ID';

@Injectable()
export class I18nService implements OnModuleInit {
  private i18nInstancesMap: Record<keyof typeof APP_LOCALES, I18n> =
    {} as Record<keyof typeof APP_LOCALES, I18n>;

  async loadTranslations() {
    // Bades single-language: hanya katalog Bahasa Indonesia yang dimuat.
    const messagesByLocale: Partial<Record<keyof typeof APP_LOCALES, Messages>> =
      {
        'id-ID': idMessages,
      };

    (
      Object.entries(messagesByLocale) as [keyof typeof APP_LOCALES, Messages][]
    ).forEach(([locale, messages]) => {
      const localeI18n = setupI18n();

      localeI18n.load(locale, messages);
      localeI18n.activate(locale);

      this.i18nInstancesMap[locale] = localeI18n;
    });
  }

  getI18nInstance(locale: keyof typeof APP_LOCALES) {
    return this.i18nInstancesMap[locale];
  }

  translateMessage({
    messageId,
    values,
    locale = SOURCE_LOCALE,
    options,
  }: {
    messageId: string;
    values?: Record<string, string>;
    locale?: keyof typeof APP_LOCALES;
    options?: MessageOptions;
  }) {
    const i18n = this.getI18nInstance(locale);

    return i18n._(messageId, values, options);
  }

  async onModuleInit() {
    await this.loadTranslations();
  }
}
