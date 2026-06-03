// Helper untuk baca token Mapbox dari env Vite.
// Dipisah ke module tersendiri supaya test bisa mock via
// `jest.mock('@/object-record/record-map/utils/getMapboxAccessToken')`
// tanpa harus berurusan dengan `import.meta` syntax yang tidak didukung
// oleh jest SWC transformer di project ini.
//
// Token HARUS ber-prefix `pk.*` (public token). Token `sk.*` (secret)
// tidak boleh dipakai di client karena akan mengekspos full API access
// (token management, styles:write, dll) ke publik.
const PUBLIC_TOKEN_PREFIX = 'pk.';
const SECRET_TOKEN_PREFIX = 'sk.';

const readToken = (): string =>
  (import.meta.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string | undefined) ?? '';

export const getMapboxAccessToken = (): string => readToken();

// Cek apakah token valid untuk dipakai di client: tidak kosong dan
// ber-prefix `pk.*`. Return false untuk token `sk.*` atau string lain.
// Delegate ke `getMapboxAccessToken` agar test bisa mock via
// `jest.mock` module ini.
export const hasValidMapboxAccessToken = (): boolean => {
  const token = getMapboxAccessToken();
  if (token.length === 0) return false;
  if (!token.startsWith(PUBLIC_TOKEN_PREFIX)) return false;
  return true;
};

// Validasi token untuk dev tooling — log warning ke console kalau
// token yang terpasang terlihat salah (kosong, atau `sk.*` ter-commit).
// Dipakai sekali saat map di-mount; tidak mengganggu user production.
// Delegate ke `getMapboxAccessToken` agar mock test tetap bekerja.
export const warnIfMapboxTokenLooksInvalid = (): void => {
  const token = getMapboxAccessToken();
  if (token.length === 0) return;
  if (token.startsWith(SECRET_TOKEN_PREFIX)) {
    // eslint-disable-next-line no-console
    console.error(
      '[Bades] REACT_APP_MAPBOX_ACCESS_TOKEN dimulai dengan "sk." — ' +
        'token SECRET tidak boleh dipakai di client. Buat token PUBLIC ' +
        'baru di https://account.mapbox.com/access-tokens/ dan rotate ' +
        'token secret yang sudah ter-expos.',
    );
    return;
  }
  if (!token.startsWith(PUBLIC_TOKEN_PREFIX)) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Bades] REACT_APP_MAPBOX_ACCESS_TOKEN tidak ber-prefix "pk." — ' +
        'pastikan token PUBLIC yang dipakai memiliki scope minimum ' +
        'styles:read, fonts:read, styles:tiles.',
    );
  }
};
