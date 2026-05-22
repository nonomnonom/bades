/**
 * Bades i18n shim.
 *
 * Bades adalah produk single-language Bahasa Indonesia. Modul ini menggantikan
 * makro & runtime `@lingui/*` dengan padanan runtime sederhana sehingga teks
 * literal Bahasa Indonesia langsung dirender tanpa katalog terjemahan.
 *
 * Tujuan: menghapus ketergantungan Lingui secara bertahap. Berkas yang sudah
 * mengimpor dari modul ini tidak lagi disentuh plugin makro Lingui.
 */
import { Fragment, type ReactNode } from 'react';

export type MessageDescriptor = {
  id?: string;
  message?: string;
  values?: Record<string, unknown>;
  comment?: string;
};

const interpolate = (
  text: string,
  values?: Record<string, unknown>,
): string => {
  if (!values) {
    return text;
  }

  return Object.entries(values).reduce(
    (acc, [key, value]) =>
      acc.replaceAll(`{${key}}`, String(value ?? '')),
    text,
  );
};

const isTemplateStringsArray = (
  value: unknown,
): value is TemplateStringsArray =>
  Array.isArray(value) &&
  Array.isArray((value as TemplateStringsArray).raw);

/**
 * `t` — dipakai sebagai tagged template (t`Halo ${nama}`) maupun pemanggilan
 * fungsi (t('teks') / t(descriptor)).
 */
export const t = (
  strings: TemplateStringsArray | string | MessageDescriptor,
  ...values: unknown[]
): string => {
  if (typeof strings === 'string') {
    return strings;
  }

  if (isTemplateStringsArray(strings)) {
    return strings.reduce(
      (acc, part, index) =>
        acc + part + (index < values.length ? String(values[index] ?? '') : ''),
      '',
    );
  }

  return interpolate(
    strings.message ?? strings.id ?? '',
    strings.values,
  );
};

/** `msg` — pada single-language berperilaku sama seperti `t`. */
export const msg = t;

/** `defineMessage` — alias `msg`. */
export const defineMessage = t;

type PluralOptions = { other: string } & Record<string, string>;

/** Bahasa Indonesia tidak membedakan bentuk jamak: selalu pakai `other`. */
export const plural = (count: number, options: PluralOptions): string => {
  const exact =
    options[`=${count}`] ?? (options as Record<string, string>)[String(count)];

  return (exact ?? options.other).replaceAll('#', String(count));
};

export const selectOrdinal = plural;

export const select = (
  value: string,
  options: { other: string } & Record<string, string>,
): string => options[value] ?? options.other;

/** Runtime `i18n` pengganti instance Lingui. */
export const i18n = {
  locale: 'id-ID',
  _: (
    descriptor: string | MessageDescriptor,
    values?: Record<string, unknown>,
  ): string => {
    if (typeof descriptor === 'string') {
      return interpolate(descriptor, values);
    }

    return interpolate(
      descriptor.message ?? descriptor.id ?? '',
      values ?? descriptor.values,
    );
  },
  load: (_locale?: unknown, _messages?: unknown): void => {},
  activate: (_locale?: unknown): void => {},
  date: (
    value: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
  ): string => new Intl.DateTimeFormat('id-ID', options).format(new Date(value)),
  number: (value: number, options?: Intl.NumberFormatOptions): string =>
    new Intl.NumberFormat('id-ID', options).format(value),
};

export const setupI18n = () => i18n;

/** `useLingui` — mengembalikan `t` dan `i18n` runtime. */
export const useLingui = () => ({ i18n, t, _: i18n._ });

/** Provider no-op; dipertahankan agar pohon komponen tidak berubah. */
export const I18nProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => <Fragment>{children}</Fragment>;

type TransProps = {
  children?: ReactNode;
  id?: string;
  message?: string;
  values?: Record<string, unknown>;
  components?: Record<string | number, ReactNode>;
};

/**
 * `Trans` — pada single-language, JSX children di source sudah berisi teks
 * final Bahasa Indonesia, jadi cukup dirender apa adanya. Bentuk `<Trans
 * id="..."/>` tanpa children memakai id/message sebagai teks.
 */
export const Trans = ({
  children,
  id,
  message,
  values,
}: TransProps): ReactNode => {
  if (children !== undefined && children !== null) {
    return <Fragment>{children}</Fragment>;
  }

  return <Fragment>{interpolate(message ?? id ?? '', values)}</Fragment>;
};
