/**
 * Password hashing — Bun.password (bcrypt-compatible).
 * Runtime production & test memakai Bun; tidak ada dependency npm `bcrypt`.
 */

export const BCRYPT_COST = 10;

export const hashPassword = async (
  password: string,
  cost: number = BCRYPT_COST,
): Promise<string> => {
  return Bun.password.hash(password, { algorithm: 'bcrypt', cost });
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return Bun.password.verify(password, passwordHash);
};
