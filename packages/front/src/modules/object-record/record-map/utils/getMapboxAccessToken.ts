// Util validasi token Mapbox public (pk.*).
// Token dibaca dari `/client-config` saat runtime — tidak di-build ke bundle
// frontend agar setiap deployment bisa memakai token Mapbox sendiri.
const PUBLIC_TOKEN_PREFIX = 'pk.';
const SECRET_TOKEN_PREFIX = 'sk.';

export const isValidMapboxAccessToken = (token: string): boolean => {
  if (token.length === 0) return false;
  if (!token.startsWith(PUBLIC_TOKEN_PREFIX)) return false;
  return true;
};

// Alias untuk kompatibilitas test yang sudah mock nama ini.
export const hasValidMapboxAccessToken = (token: string): boolean =>
  isValidMapboxAccessToken(token);

// Validasi token untuk dev tooling — log warning ke console kalau
// token yang terpasang terlihat salah (kosong, atau `sk.*` ter-commit).
export const warnIfMapboxTokenLooksInvalid = (token: string): void => {
  if (token.length === 0) return;
  if (token.startsWith(SECRET_TOKEN_PREFIX)) {
    // eslint-disable-next-line no-console
    console.error(
      '[Bades] MAPBOX_ACCESS_TOKEN dimulai dengan "sk." — ' +
        'token SECRET tidak boleh dipakai di client. Buat token PUBLIC ' +
        'baru di https://account.mapbox.com/access-tokens/ dan rotate ' +
        'token secret yang sudah ter-expos.',
    );
    return;
  }
  if (!token.startsWith(PUBLIC_TOKEN_PREFIX)) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Bades] MAPBOX_ACCESS_TOKEN tidak ber-prefix "pk." — ' +
        'pastikan token PUBLIC yang dipakai memiliki scope minimum ' +
        'styles:read, fonts:read, styles:tiles.',
    );
  }
};
