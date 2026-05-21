import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const templatesDir = 'packages/docker/helm/twenty/templates';
const files = readdirSync(templatesDir).filter(f => f.endsWith('.yaml') || f.endsWith('.tpl'));

for (const file of files) {
  const path = join(templatesDir, file);
  let content = readFileSync(path, 'utf-8');
  const orig = content;

  // Replace all include/define "twenty." -> "bades."
  content = content.replace(/include "twenty\./g, 'include "bades.');
  content = content.replace(/define "twenty\./g, 'define "bades.');

  // Replace default database name
  content = content.replace(/default "twenty"/g, 'default "bades"');
  content = content.replace(/default \"twenty\"/g, 'default \"bades\"');
  content = content.replace(/default \'twenty\'/g, "default 'bades'");
  content = content.replace(/database | default "twenty"/g, 'database | default "bades"');

  // Replace twenty_app_user
  content = content.replace(/twenty_app_user/g, 'bades_app_user');

  // Replace mount path twenty-server -> server
  content = content.replace(/\/app\/packages\/twenty-server\//g, '/app/packages/server/');

  if (content !== orig) {
    writeFileSync(path, content);
    console.log(`Updated: ${file} (${(content.match(/bades\./g) || []).length} replacements)`);
  }
}
console.log('\nAll Helm template files processed.');
