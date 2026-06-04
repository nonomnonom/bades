import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

import {
  hashPassword,
  verifyPassword,
} from 'src/engine/core-modules/auth/password.util';

export { hashPassword };
export const PASSWORD_REGEX = /^.{8,50}$/;

export const compareHash = verifyPassword;

export const encryptText = (textToEncrypt: string, key: string): string => {
  const keyHash = createHash('sha512')
    .update(key)
    .digest('hex')
    .substring(0, 32);

  const iv = randomBytes(16);

  const cipher = createCipheriv('aes-256-ctr', keyHash, iv);

  return Buffer.concat([
    iv,
    cipher.update(textToEncrypt),
    cipher.final(),
  ]).toString('base64');
};

export const decryptText = (textToDecrypt: string, key: string): string => {
  const textBuffer = Buffer.from(textToDecrypt, 'base64');
  const iv = textBuffer.subarray(0, 16);
  const text = textBuffer.subarray(16);

  const keyHash = createHash('sha512')
    .update(key)
    .digest('hex')
    .substring(0, 32);

  const decipher = createDecipheriv('aes-256-ctr', keyHash, iv);

  return Buffer.concat([decipher.update(text), decipher.final()]).toString();
};
