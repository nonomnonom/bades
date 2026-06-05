import {
  getSharedAuthCookieAttributes,
  isLocalDevelopmentFrontDomain,
} from '@/auth/utils/sharedAuthCookieUtil';

describe('isLocalDevelopmentFrontDomain', () => {
  it('mengenali localhost dan subdomain .localhost', () => {
    expect(isLocalDevelopmentFrontDomain('localhost')).toBe(true);
    expect(isLocalDevelopmentFrontDomain('127.0.0.1')).toBe(true);
    expect(isLocalDevelopmentFrontDomain('nonom.localhost')).toBe(true);
  });

  it('tidak mengenali domain produksi', () => {
    expect(isLocalDevelopmentFrontDomain('bades.id')).toBe(false);
    expect(isLocalDevelopmentFrontDomain('app.bades.id')).toBe(false);
  });
});

describe('getSharedAuthCookieAttributes', () => {
  it('tidak set domain untuk localhost agar cookie host-only diterima browser', () => {
    expect(getSharedAuthCookieAttributes('localhost', true)).toBeUndefined();
  });

  it('set domain bersama untuk multi-workspace produksi', () => {
    expect(getSharedAuthCookieAttributes('bades.id', true)).toEqual({
      domain: '.bades.id',
    });
  });

  it('tidak set domain saat multi-workspace nonaktif', () => {
    expect(getSharedAuthCookieAttributes('bades.id', false)).toBeUndefined();
  });
});
