import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import {
  generateFrontConfig,
  getFrontConfigScriptBlock,
} from 'src/utils/generate-front-config';

describe('generateFrontConfig', () => {
  it('getFrontConfigScriptBlock tidak inject REACT_APP_SERVER_BASE_URL', () => {
    const configBlock = getFrontConfigScriptBlock();

    expect(configBlock).toContain('window._env_ = {}');
    expect(configBlock).not.toContain('REACT_APP_SERVER_BASE_URL');
  });

  it('generateFrontConfig menulis config kosong ke index.html', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bades-front-config-'));
    const indexPath = path.join(tempDir, 'index.html');

    fs.writeFileSync(
      indexPath,
      `<!DOCTYPE html>
<html>
  <head>
    <!-- BEGIN: Bades Config -->
    <script id="bades-env-config">
      window._env_ = {
        REACT_APP_SERVER_BASE_URL: "https://bades.id"
      };
    </script>
    <!-- END: Bades Config -->
  </head>
</html>`,
      'utf8',
    );

    generateFrontConfig({ frontDistPath: tempDir });

    const indexContent = fs.readFileSync(indexPath, 'utf8');

    expect(indexContent).toContain('window._env_ = {}');
    expect(indexContent).not.toContain('REACT_APP_SERVER_BASE_URL');
  });
});
