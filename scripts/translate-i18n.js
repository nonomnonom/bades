#!/usr/bin/env node
/**
 * PO to JSON converter and translation processor
 */

const fs = require('fs');
const path = require('path');

function parsePoFile(poFilePath) {
  const content = fs.readFileSync(poFilePath, 'utf-8');
  const mappings = {};

  // Split by double newlines (entry separator)
  const entries = content.split('\n\n');

  for (const entry of entries) {
    const lines = entry.split('\n');
    let msgid = '';
    let msgstr = '';

    for (const line of lines) {
      if (line.startsWith('msgid ')) {
        msgid = line.substring(6).replace(/^"|"$/g, '').replace(/\\"/g, '"');
      } else if (line.startsWith('msgstr ')) {
        msgstr = line.substring(7).replace(/^"|"$/g, '').replace(/\\"/g, '"');
      }
    }

    if (msgid && msgstr && msgid !== msgstr && msgid.length > 1) {
      // Handle escaped characters
      const decodedMsgid = msgid
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r');
      const decodedMsgstr = msgstr
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r');

      mappings[decodedMsgid] = decodedMsgstr;
    }
  }

  return mappings;
}

function translateFile(filePath, mappings) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Replace patterns
  const patterns = [
    // <Trans>text</Trans>
    [/\<Trans\>([\s\S]*?)\<\/Trans\>/g, (m, text) => {
      const trans = mappings[text.trim()];
      return trans !== undefined ? trans : m;
    }],
    // t`text`
    [/t`([^`]+)`/g, (m, text) => {
      const trans = mappings[text.trim()];
      return trans !== undefined ? `"${trans}"` : m;
    }],
    // msg`text`
    [/msg`([^`]+)`/g, (m, text) => {
      const trans = mappings[text.trim()];
      return trans !== undefined ? `"${trans}"` : m;
    }],
    // i18n._(`text`)
    [/i18n\._\(`([^`]+)`\)/g, (m, text) => {
      const trans = mappings[text.trim()];
      return trans !== undefined ? `"${trans}"` : m;
    }],
  ];

  for (const [pattern, replacer] of patterns) {
    content = content.replace(pattern, replacer);
  }

  // Check if modified
  if (content !== fs.readFileSync(filePath, 'utf-8')) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

function getFiles(dir, skipDirs = []) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.includes(entry.name) && !entry.name.startsWith('.')) {
        files.push(...getFiles(fullPath, skipDirs));
      }
    } else if (['.tsx', '.ts'].includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Main
const poFile = process.argv[2];
const sourceDir = process.argv[3];

if (!poFile || !sourceDir) {
  console.log('Usage: node translate.js <po-file> <source-dir>');
  process.exit(1);
}

console.log(`Parsing ${poFile}...`);
const mappings = parsePoFile(poFile);
console.log(`Found ${Object.keys(mappings).length} translations`);

// Save mappings for debugging
fs.writeFileSync('mappings.json', JSON.stringify(mappings, null, 2));

// Process files
const files = getFiles(sourceDir, ['node_modules', 'dist', 'generated', '__tests__', '__mocks__', 'locales']);
console.log(`Found ${files.length} files`);

let modified = 0;
for (const file of files) {
  if (translateFile(file, mappings)) {
    console.log(`Translated: ${file.replace(process.cwd(), '')}`);
    modified++;
  }
}

console.log(`\nDone! Modified ${modified}/${files.length} files`);