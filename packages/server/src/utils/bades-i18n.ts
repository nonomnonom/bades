/**
 * Bades i18n shim (sisi server).
 *
 * Bades adalah produk single-language Bahasa Indonesia. Modul ini menggantikan
 * makro & runtime `@lingui/*` dengan padanan runtime sederhana agar teks
 * literal Bahasa Indonesia langsung dipakai tanpa katalog terjemahan.
 */

export type MessageDescriptor = {
  id?: string;
  message?: string;
  values?: Record<string, unknown>;
  comment?: string;
};

export type MessageOptions = {
  message?: string;
  formats?: unknown;
  comment?: string;
};

export type Messages = Record<string, string>;

const interpolate = (
  text: string,
  values?: Record<string, unknown>,
): string => {
  if (!values) {
    return text;
  }

  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.split(`{${key}}`).join(String(value ?? '')),
    text,
  );
};

const isTemplateStringsArray = (
  value: unknown,
): value is TemplateStringsArray =>
  Array.isArray(value) && Array.isArray((value as { raw?: unknown }).raw);

const joinTemplate = (
  strings: TemplateStringsArray,
  values: unknown[],
): string =>
  strings.reduce(
    (acc, part, index) =>
      acc + part + (index < values.length ? String(values[index] ?? '') : ''),
    '',
  );

/** `t` — tagged template / pemanggilan fungsi yang mengembalikan string. */
export const t = (
  strings: TemplateStringsArray | string | MessageDescriptor,
  ...values: unknown[]
): string => {
  if (typeof strings === 'string') {
    return strings;
  }

  if (isTemplateStringsArray(strings)) {
    return joinTemplate(strings, values);
  }

  return interpolate(strings.message ?? strings.id ?? '', strings.values);
};

/** `msg` — mengembalikan MessageDescriptor agar kompatibel dengan field bertipe itu. */
export const msg = (
  strings: TemplateStringsArray | string,
  ...values: unknown[]
): MessageDescriptor => {
  const message =
    typeof strings === 'string' ? strings : joinTemplate(strings, values);

  return { message };
};

export const defineMessage = msg;

export type I18n = {
  locale: string;
  _: (
    descriptor: string | MessageDescriptor,
    values?: Record<string, unknown>,
    options?: MessageOptions,
  ) => string;
  load: (locale?: unknown, messages?: unknown) => void;
  activate: (locale?: unknown) => void;
};

const resolve = (
  descriptor: string | MessageDescriptor,
  values?: Record<string, unknown>,
  options?: MessageOptions,
): string => {
  if (typeof descriptor === 'string') {
    return interpolate(descriptor, values);
  }

  return interpolate(
    descriptor.message ?? descriptor.id ?? options?.message ?? '',
    values ?? descriptor.values,
  );
};

export const setupI18n = (): I18n => ({
  locale: 'id-ID',
  _: resolve,
  load: () => {},
  activate: () => {},
});

export const i18n: I18n = setupI18n();
