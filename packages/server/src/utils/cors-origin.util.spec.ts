import {
  getAllowedCorsOriginHeader,
  isOriginAllowed,
} from 'src/utils/cors-origin.util';

describe('cors-origin.util', () => {
  const originalFrontendUrl = process.env.FRONTEND_URL;
  const originalServerUrl = process.env.SERVER_URL;

  afterEach(() => {
    process.env.FRONTEND_URL = originalFrontendUrl;
    process.env.SERVER_URL = originalServerUrl;
  });

  it('mengizinkan semua origin saat env kosong', () => {
    delete process.env.FRONTEND_URL;
    delete process.env.SERVER_URL;

    expect(isOriginAllowed('https://desa.bades.id')).toBe(true);
    expect(getAllowedCorsOriginHeader('https://desa.bades.id')).toBe(
      'https://desa.bades.id',
    );
  });

  it('mengizinkan subdomain dari domain produksi', () => {
    process.env.FRONTEND_URL = 'https://app.bades.id';
    process.env.SERVER_URL = 'https://api.bades.id';

    expect(isOriginAllowed('https://desa.bades.id')).toBe(true);
    expect(getAllowedCorsOriginHeader('https://desa.bades.id')).toBe(
      'https://desa.bades.id',
    );
  });

  it('menolak origin yang tidak terdaftar', () => {
    process.env.FRONTEND_URL = 'https://app.bades.id';
    process.env.SERVER_URL = 'https://api.bades.id';

    expect(isOriginAllowed('https://evil.example.com')).toBe(false);
    expect(getAllowedCorsOriginHeader('https://evil.example.com')).toBe(
      'https://app.bades.id',
    );
  });
});
