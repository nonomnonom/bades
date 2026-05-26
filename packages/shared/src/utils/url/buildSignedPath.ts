import { isNonEmptyString } from '@sniptt/guards';

export const buildSignedPath = ({
  path,
  token,
}: {
  path: string;
  token: string;
}) => {
  if (path.startsWith('https:') || path.startsWith('http:')) {
    return path;
  }

  const directories = path.split('/');

  const filename = directories.pop();

  if (!isNonEmptyString(filename)) {
    throw new Error(
      `Nama berkas kosong: tidak dapat membuat jalur tertandatangani dari '${path}'`,
    );
  }

  return `${directories.join('/')}/${token}/${filename}`;
};
