import Cookies from 'js-cookie';

const DEFAULT_COOKIE_ATTRIBUTES = {
  path: '/',
  secure: window.location.protocol === 'https:',
  sameSite: 'lax' as const,
};

class CookieStorage {
  private keys: Set<string> = new Set();

  getItem(key: string): string | undefined {
    return Cookies.get(key);
  }

  setItem(
    key: string,
    value: string,
    attributes?: Cookies.CookieAttributes,
  ): void {
    this.keys.add(key);

    Cookies.set(key, value, {
      ...DEFAULT_COOKIE_ATTRIBUTES,
      ...attributes,
    });
  }

  removeItem(key: string, attributes?: Cookies.CookieAttributes): void {
    this.keys.delete(key);

    // Hapus dengan atribut yang diberikan
    Cookies.remove(key, {
      ...DEFAULT_COOKIE_ATTRIBUTES,
      ...attributes,
    });

    // Hapus varian host-only tanpa path
    Cookies.remove(key);

    // Hapus varian dengan secure terbalik (untuk jaga-jaga kalau cookie
    // ditulis dari HTTPS lalu di-clear dari HTTP atau sebaliknya)
    const invertedSecure = !DEFAULT_COOKIE_ATTRIBUTES.secure;
    Cookies.remove(key, {
      ...DEFAULT_COOKIE_ATTRIBUTES,
      secure: invertedSecure,
    });
    Cookies.remove(key, { secure: invertedSecure });

    // Hapus dengan sameSite strict/none sebagai fallback
    Cookies.remove(key, { ...DEFAULT_COOKIE_ATTRIBUTES, sameSite: 'strict' });
    Cookies.remove(key, { sameSite: 'strict' });
    Cookies.remove(key, { ...DEFAULT_COOKIE_ATTRIBUTES, sameSite: 'none' });
    Cookies.remove(key, { sameSite: 'none' });
  }

  clear(): void {
    this.keys.forEach((key) => this.removeItem(key));
  }
}

export const cookieStorage = new CookieStorage();
