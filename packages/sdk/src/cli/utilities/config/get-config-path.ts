import * as os from 'os';
import * as path from 'path';

const BADES_DIR = path.join(os.homedir(), '.bades');

export const getConfigPath = (test = false): string => {
  if (test || process.env.NODE_ENV === 'test') {
    return path.join(BADES_DIR, 'config.test.json');
  }

  return path.join(BADES_DIR, 'config.json');
};
