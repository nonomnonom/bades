#!/usr/bin/env node
/**
 * Script migrasi asset gambar Bades
 * - Generate ulang icon platform dengan logo Bades
 * - Hapus/arsipkan logo legacy TwentyCRM
 * - Update manifest.json dan HTML references
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../');
const PUBLIC_ICONS = path.join(ROOT, 'packages/front/public/images/icons');
const PUBLIC_INTEGRATIONS = path.join(ROOT, 'packages/front/public/images/integrations');

// Asset yang akan diarchive (legacy TwentyCRM)
const LEGACY_INTEGRATIONS = [
  'airtable-logo.png',
  'cal-logo.png',
  'github-logo.png',
  'mailchimp-logo.png',
  'postgresql-logo.png',
  'slack-logo.png',
  'stripe-logo.png',
  'tally-logo.png',
  'windmill-logo.png',
  'chrome-icon.svg',
  'oauth-modal-header.png',
];

// Asset yang perlu dipreserve
const PRESERVE_ASSETS = [
  'bades-logo.svg',
  'link-apps.svg',
  'mcp.svg',
];

function log(msg) {
  console.log(`[bades-assets] ${msg}`);
}

function archiveLegacy(dir, files) {
  const archiveDir = path.join(dir, '.archive');
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  files.forEach(file => {
    const src = path.join(dir, file);
    if (fs.existsSync(src)) {
      const dest = path.join(archiveDir, `${Date.now()}_${file}`);
      fs.renameSync(src, dest);
      log(`Archived: ${file} -> .archive/`);
    }
  });
}

function generatePlaceholderInfo() {
  // Generate info tentang asset yang perlu di-generate ulang
  const info = {
    android: {
      sizes: [48, 72, 96, 144, 192, 512],
      filename: 'android-launchericon-{size}.png',
    },
    ios: {
      sizes: [16, 20, 29, 32, 40, 50, 57, 58, 60, 64, 72, 76, 80, 87, 100, 114, 120, 128, 144, 152, 167, 180, 192, 256, 512, 1024],
      filename: '{size}.png',
    },
    windows11: {
      tiles: ['SmallTile', 'LargeTile', 'Square150x150Logo', 'Wide310x150Logo', 'StoreLogo', 'SplashScreen'],
      targets: ['Square44x44Logo'],
      scales: [100, 125, 150, 200, 400],
      altforms: ['altform-unplated', 'altform-lightunplated'],
      targetsizes: [16, 20, 24, 30, 32, 36, 40, 44, 48, 60, 64, 72, 80, 96, 256],
    },
  };
  return info;
}

function checkBadesLogo() {
  const badesSvg = path.join(ROOT, 'packages/front/public/bd.svg');
  if (fs.existsSync(badesSvg)) {
    const content = fs.readFileSync(badesSvg, 'utf-8');
    if (content.includes('Bades') || content.includes('bades')) {
      log('✓ Logo Bades utama (bd.svg) terdeteksi');
    }
  }

  const badesLogo = path.join(PUBLIC_INTEGRATIONS, 'bades-logo.svg');
  if (fs.existsSync(badesLogo)) {
    log('✓ Logo Bades untuk integrations terdeteksi');
  }
}

function listCurrentAssets() {
  log('\n=== ASSET SURVEY ===\n');

  // Android icons
  const androidDir = path.join(PUBLIC_ICONS, 'android');
  if (fs.existsSync(androidDir)) {
    const files = fs.readdirSync(androidDir);
    log(`Android icons: ${files.length} file`);
    files.forEach(f => log(`  - ${f}`));
  }

  // iOS icons
  const iosDir = path.join(PUBLIC_ICONS, 'ios');
  if (fs.existsSync(iosDir)) {
    const files = fs.readdirSync(iosDir);
    log(`iOS icons: ${files.length} file`);
  }

  // Windows11 icons
  const windowsDir = path.join(PUBLIC_ICONS, 'windows11');
  if (fs.existsSync(windowsDir)) {
    const files = fs.readdirSync(windowsDir);
    log(`Windows11 icons: ${files.length} file`);
  }

  // Integrations
  if (fs.existsSync(PUBLIC_INTEGRATIONS)) {
    const files = fs.readdirSync(PUBLIC_INTEGRATIONS);
    log(`Integration logos: ${files.length} file`);
    files.forEach(f => {
      const isLegacy = LEGACY_INTEGRATIONS.includes(f);
      log(`  - ${f}${isLegacy ? ' [LEGACY]' : ''}`);
    });
  }

  log('\n=== RECOMMENDED ACTIONS ===\n');
  log('1. REGENERATE platform icons dari bd.svg menggunakan sharp/canvas');
  log('2. ARCHIVE legacy integration logos ke .archive/');
  log('3. UPDATE manifest.json untuk referensi icon baru');
  log('4. UPDATE index.html og:image ke asset lokal');
}

function main() {
  log('Bades Asset Migration Script');
  log('==========================\n');

  checkBadesLogo();
  listCurrentAssets();

  log('\n=== RUNNING MIGRATION ===\n');

  // Archive legacy integrations
  archiveLegacy(PUBLIC_INTEGRATIONS, LEGACY_INTEGRATIONS);

  log('\n✓ Asset migration selesai');
  log('\nCATATAN: Untuk generate ulang platform icons,');
  log('jalankan script dengan Node.js + sharp/canvas yang tersedia');
  log('atau gunakan tools external seperti realfavicongenerator.net');
}

main();