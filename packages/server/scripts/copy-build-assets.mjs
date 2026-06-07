// Setara packages/twenty-server/project.json build: copy client-sdk ke dist/assets/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(scriptDir, '..');
const sourceRoot = path.join(serverRoot, '../client-sdk');
const targetRoot = path.join(serverRoot, 'dist/assets/client-sdk');

fs.mkdirSync(targetRoot, { recursive: true });
fs.copyFileSync(
  path.join(sourceRoot, 'package.json'),
  path.join(targetRoot, 'package.json'),
);
fs.cpSync(path.join(sourceRoot, 'dist'), path.join(targetRoot, 'dist'), {
  recursive: true,
});
