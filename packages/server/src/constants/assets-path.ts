import path from 'path';

// Deteksi output compile (dist/) harus cross-platform — di Windows __dirname memakai
// backslash sehingga includes('/dist/') selalu false dan ASSET_PATH salah.
export const isRunningFromCompiledDist = (dirname: string): boolean =>
  dirname.replace(/\\/g, '/').includes('/dist/');

export const ASSET_PATH = isRunningFromCompiledDist(__dirname)
  ? path.resolve(__dirname, '../assets')
  : path.resolve(__dirname, '../');
