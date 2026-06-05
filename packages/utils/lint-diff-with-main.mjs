#!/usr/bin/env node
/**
 * Lint + Prettier hanya untuk file TS/TSX yang berubah vs main.
 * Cross-platform (Windows + Unix) — pengganti shell one-liner di project.json.
 */
import { execSync, spawnSync } from 'node:child_process';

const BATCH_SIZE = 15;
const fix = process.argv.includes('--fix');
const projectRoot = process.cwd();

let diffOutput = '';
let untrackedOutput = '';
try {
  diffOutput = execSync(`git diff --name-only --relative --diff-filter=d main -- src/`, {
    cwd: projectRoot,
    encoding: 'utf8',
  });
} catch {
  diffOutput = '';
}

try {
  untrackedOutput = execSync(
    'git ls-files --others --exclude-standard -- src/',
    { cwd: projectRoot, encoding: 'utf8' },
  );
} catch {
  untrackedOutput = '';
}

const files = [
  ...new Set(
    [diffOutput, untrackedOutput].join('\n').split(/\r?\n/),
  ),
]
  .map((line) => line.trim())
  .filter((line) => line.length > 0 && /\.(ts|tsx)$/.test(line));

if (files.length === 0) {
  console.log('No changed files.');
  process.exit(0);
}

const runCommand = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  return result.status ?? 1;
};

const batches = [];
for (let index = 0; index < files.length; index += BATCH_SIZE) {
  batches.push(files.slice(index, index + BATCH_SIZE));
}

for (const batch of batches) {
  const oxlintStatus = runCommand('npx', [
    'oxlint',
    '--type-aware',
    ...(fix ? ['--fix'] : []),
    '-c',
    '.oxlintrc.json',
    ...batch,
  ]);
  if (oxlintStatus !== 0) {
    process.exit(oxlintStatus);
  }
}

for (const batch of batches) {
  const prettierStatus = runCommand('npx', [
    'prettier',
    ...(fix ? ['--write'] : ['--check']),
    ...batch,
  ]);
  if (prettierStatus !== 0) {
    if (!fix) {
      const projectName = projectRoot.split(/[/\\]/).pop() ?? 'project';
      console.error(
        `ERROR: Prettier formatting check failed! Fix with: npx nx lint:diff-with-main ${projectName} --configuration=fix`,
      );
    }
    process.exit(prettierStatus);
  }
}
