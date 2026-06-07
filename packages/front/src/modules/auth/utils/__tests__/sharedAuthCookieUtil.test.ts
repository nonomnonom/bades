import {
  clearTokenPairCookie,
  getSharedAuthCookieAttributes,
  isLocalDevelopmentFrontDomain,
} from '@/auth/utils/sharedAuthCookieUtil';
import { cookieStorage } from '~/utils/cookie-storage';

jest.mock('~/utils/cookie-storage', () => ({
  cookieStorage: {
    removeItem: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

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
      path: '/',
    });
  });

  it('tidak set domain saat multi-workspace nonaktif', () => {
    expect(getSharedAuthCookieAttributes('bades.id', false)).toBeUndefined();
  });
});

describe('clearTokenPairCookie', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('menghapus varian host-only dan domain bersama', () => {
    clearTokenPairCookie('bades.id', true);

    expect(cookieStorage.removeItem).toHaveBeenCalledWith('tokenPair');
    expect(cookieStorage.removeItem).toHaveBeenCalledWith('tokenPair', {
      path: '/',
    });
    expect(cookieStorage.removeItem).toHaveBeenCalledWith('tokenPair', {
      domain: '.bades.id',
      path: '/',
    });
  });

  it('tetap menghapus varian domain produksi meski multi-workspace nonaktif', () => {
    clearTokenPairCookie('bades.id', false);

    expect(cookieStorage.removeItem).toHaveBeenCalledWith('tokenPair', {
      domain: '.bades.id',
      path: '/',
    });
  });

  it('hanya menghapus host-only untuk localhost', () => {
    clearTokenPairCookie('localhost', true);

    expect(cookieStorage.removeItem).toHaveBeenCalledTimes(2);
    expect(cookieStorage.removeItem).toHaveBeenCalledWith('tokenPair');
    expect(cookieStorage.removeItem).toHaveBeenCalledWith('tokenPair', {
      path: '/',
    });
  });
});
