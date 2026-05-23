import { Injectable } from '@nestjs/common';

import {
  type I18n,
  type MessageOptions,
  setupI18n,
} from 'src/utils/bades-i18n';

/**
 * Bades single-language: tidak ada katalog terjemahan. Service ini
 * mengembalikan pesan apa adanya (Bahasa Indonesia) dengan interpolasi nilai.
 */
@Injectable()
export class I18nService {
  private readonly i18nInstance: I18n = setupI18n();

  getI18nInstance(_locale?: unknown): I18n {
    return this.i18nInstance;
  }

  translateMessage({
    messageId,
    values,
    options,
  }: {
    messageId: string;
    values?: Record<string, string>;
    locale?: unknown;
    options?: MessageOptions;
  }) {
    return this.i18nInstance._(messageId, values, options);
  }
}
