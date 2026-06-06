import * as fs from 'fs';
import * as path from 'path';

import { config } from 'dotenv';
config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  override: true,
});

export function getFrontConfigScriptBlock(): string {
  return `<!-- BEGIN: Bades Config -->
    <script id="bades-env-config">
      window._env_ = {};
    </script>
    <!-- END: Bades Config -->`;
}

export function generateFrontConfig(options?: {
  frontDistPath?: string;
}): void {
  const configString = getFrontConfigScriptBlock();

  const distPath =
    options?.frontDistPath ?? path.join(__dirname, '..', 'front');
  const indexPath = path.join(distPath, 'index.html');

  try {
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    indexContent = indexContent.replace(
      /<!-- BEGIN: Bades Config -->[\s\S]*?<!-- END: Bades Config -->/,
      configString,
    );

    fs.writeFileSync(indexPath, indexContent, 'utf8');
  } catch {
    // oxlint-disable-next-line no-console
    console.log(
      'Frontend build not found or not writable, assuming it is served independently',
    );
  }
}
