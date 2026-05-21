import {
  APP_LOCALES,
  SOURCE_LOCALE,
  type AppLocale,
} from 'shared/translations';

// Website localization is intentionally rolled out separately from the app.
// Keep this allowlist small until Crowdin sync, SEO signals, and QA are proven.
export const WEBSITE_LOCALE_LIST = [
  SOURCE_LOCALE,
  APP_LOCALES['id-ID'],
] as const satisfies readonly AppLocale[];
