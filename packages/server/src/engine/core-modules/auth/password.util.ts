/**
 * Password hashing utility — Bun.password di production, bcrypt fallback di Node.js/test.
 */

declare const Bun: {
  password: {
    hash: (password: string, options?: { algorithm: string; cost: number }) => Promise<string>;
    verify: (password: string, hash: string) => Promise<boolean>;
  };
} | undefined;

type BcryptModule = typeof import('bcrypt');

let _bcryptModule: BcryptModule | null = null;
let _importPromise: Promise<BcryptModule> | null = null;

async function loadBcrypt(): Promise<BcryptModule> {
  if (_bcryptModule) return _bcryptModule;
  if (!_importPromise) {
    _importPromise = import('bcrypt');
  }
  _bcryptModule = await _importPromise;
  return _bcryptModule;
}

export const BCRYPT_COST = 10;

export const hashPassword = async (
  password: string,
  cost: number = BCRYPT_COST,
): Promise<string> => {
  // Bun runtime (production)
  if (typeof Bun !== 'undefined') {
    return Bun.password.hash(password, { algorithm: 'bcrypt', cost });
  }

  // Node.js runtime (Jest tests)
  const bcrypt = await loadBcrypt();
  return bcrypt.hash(password, cost);
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  // Bun runtime (production)
  if (typeof Bun !== 'undefined') {
    return Bun.password.verify(password, passwordHash);
  }

  // Node.js runtime (Jest tests)
  const bcrypt = await loadBcrypt();
  return bcrypt.compare(password, passwordHash);
};
