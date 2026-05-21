# BESOK-REVIEW.md

Tanggal: 2026-05-21 s/d 2026-05-22
Repo: D:\bades (branch: rebrand-bades)
Tujuan: Dekatkan codebase ke GOAL.md - audit dan perbaiki brand, copy, seed, dan surface publik

---

## STATUS RINGKAS (per 2026-05-22)

### Sudah benar-benar beres & terverifikasi

- **`.github` & workflow CI** — path paket & nama proyek nx diperbaiki
  (`twenty-*` → nama baru), YAML valid. Iterasi 1.
- **`README.md`** — ditulis ulang Bahasa Indonesia, posisi layanan terkelola.
  Iterasi 1.
- **Website home/product** — terminologi CRM → konteks SID. Iterasi 1.
- **Seed data** — nama Amerika → Indonesia, konstanta workspace di-rename.
  Iterasi 1.
- **AI single-model surface** — pemilih model dihapus dari chat, form agen,
  workflow, settings. `nx typecheck front` lulus. Iterasi 2. Commit `ebefe24c`.
- **Korupsi `id-ID.po`** — 434 entri rusak diterjemahkan ulang penuh;
  `nx run front:lingui:compile` lulus. Iterasi 3.
- **Surface platform di navigasi settings** — menu `Apps` dan `Updates`
  disembunyikan dari navigasi pengguna utama (jadi kapabilitas internal tim).
  `nx typecheck front` lulus. Iterasi 4.
- **Test `useSettingsNavigationItems.test.tsx`** — diperbaiki (assertion label
  Inggris → label Indonesia aktual). 3/3 test lulus. Iterasi 5.

### Masih terbuka (debt, belum disentuh)

- Docs (`packages/docs`) — transformasi besar, link-sensitif.
- Settings & navigasi user-facing umum.
- Billing Midtrans-first.
- Platform surface (API key/webhook/app) → pindah ke admin/internal.
- Rename direktori `packages/create-twenty-app` → `create-bades-app`
  (terblokir file lock saat dicoba).
- Website: customer case studies, release notes `.mdx`, `TermsDocument.tsx`
  (`Bades.id.com PBC`).
- Kemungkinan ada test lain di `packages/front` yang masih meng-assert label
  Inggris padahal produk kini Bahasa Indonesia (pola yang sama dengan test
  navigasi settings yang sudah diperbaiki di iterasi 5). Perlu sisir terpisah.

### Catatan paralel

Rename `packages/server/src/engine/twenty-orm` → `sid-orm` dikerjakan proses
lain; secara fungsional sudah lengkap (hanya sisa komentar `#:` lokasi sumber
di server `id-ID.po` yang otomatis terperbarui saat `lingui:extract`).

Detail lengkap per iterasi ada di bawah.

---

## Perubahan Penting yang Sudah Diterapkan

### 1. Brand Leak Fixes

| File | Masalah | Status |
|------|---------|--------|
| `packages/front/src/utils/__tests__/title-utils.test.ts:50-51` | Test expect 'Twenty' untuk homepage path | **FIXED** |
| `packages/zapier/package.json:4` | Description "Effortlessly sync Twenty with 3000+ apps..." | **FIXED** |
| `bd.svg` | Logo utama Bades | **VERIFIED** - ada di root |
| `packages/front/public/manifest.json` | Nama "Bades.id - Sistem Informasi Desa" | **COMPLIANT** |

### 2. CRM Seed Removal

| File | Masalah | Status |
|------|---------|--------|
| `dev-seeder-metadata.service.ts` | CRM seeds aktif (company, opportunity lama, pet, rocket, survey, employment-history) | **FIXED** - seed CRM dihapus |

### 3. Translation Fixes

| File | Masalah | Status |
|------|---------|--------|
| `id-ID.po` entries (~40+ edit) | Perbaikan terjemahan natural Bahasa Indonesia | **FIXED** |
| `packages/emails/src/locales/id-ID.po` | `Github` → `GitHub`, `Website` → `Situs Web` | **FIXED** |
| `id-ID.po` lines 3588-3592 | "Exclude the following people..." | **FIXED** |
| `id-ID.po` typo fixes | "Prafilling", "Prafix", "Pravent" | **FIXED** |

### 4. Website Homepage Rewrite

| Sebelum | Sesudah | Status |
|---------|---------|--------|
| "Build your Enterprise CRM at AI Speed" | "Sistem Informasi Desa untuk Indonesia" | **FIXED** |
| "Compose your CRM..." (2x) | "Bangun aplikasi dan layanan desa..." | **FIXED** |
| "Adapt your CRM to fit..." | "Kustomisasi tanpa batas sesuai kebutuhan desa Anda" | **FIXED** |
| "Don't get locked..." | "Jangan terkunci di ekosistem orang lain..." | **FIXED** |
| "A custom CRM gives your org an edge" | "Sistem Informasi Desa memberi keunggulan" | **FIXED** |
| "Assemble, iterate and adapt a robust CRM" | "Rakit, iterasi, dan sesuaikan sistem yang robust" | **FIXED** |
| "Make your GTM team happy" | "Buat tim operasional Anda puas" | **FIXED** |
| "a CRM they'll love" | "sistem yang akan mereka sukai" | **FIXED** |
| "They are the real sales" | "Mereka adalah pengguna sebenarnya" | **FIXED** |

### 5. Website GitHub API & Terminal Brand Fixes

| File | Sebelum | Sesudah | Status |
|------|---------|---------|--------|
| `fetch-github-star-count.ts` | `twentyhq/twenty` | `badesid/bades` | **FIXED** |
| `fetch-latest-release-tag.ts` | `twentyhq/twenty` | `badesid/bades` | **FIXED** |
| `AppWindow.tsx` | `twenty-app-window` | `bades-app-window` | **FIXED** |
| `TerminalPromptFooter.tsx` | `~/code/my-twenty-app` | `~/code/my-bades-app` | **FIXED** |
| `diff-data.ts` (6x) | `my-twenty-app/...` | `my-bades-app/...` | **FIXED** |
| `terminal-traffic-light-constants.ts` | `twenty-traffic-lights-escape` | `bades-traffic-lights-escape` | **FIXED** |
| `editor-explorer-nodes.ts` | `my-twenty-app` | `my-bades-app` | **FIXED** |
| `AssistantResponseSegments.tsx` | `yarn twenty dev --once` | `yarn bades dev --once` | **FIXED** |

---

## Area yang Sudah Dibersihkan

### .github & Contributor Surface
- `.github/CONTRIBUTING.md` - sudah istilah Bades
- Labels, issue templates, PR templates - sudah align

### Seed Data (Bades SID Standard Seed)
6 domain GOAL.md sudah terimplementasi:
1. **Demografi & Wilayah**: Penduduk, Keluarga/KK
2. **Pemerintahan Desa**: Jabatan, Lembaga Desa
3. **Pelayanan Surat**: Jenis Surat, Permohonan Surat
4. **Keuangan Desa**: Anggaran, Realisasi Anggaran
5. **Program Sosial & Bantuan**: Program Bantuan, Penerima Bantuan
6. **Aset & Ekonomi**: Aset Desa, UMKM

### User-Facing Surface (Bahasa Indonesia)
- Settings navigation labels sudah Bahasa Indonesia
- Empty state, toast, modal labels - sudah lokalisasi id-ID
- Manifest dan metadata - nama produk "Bades.id"

---

## INVENTORI AREA MASIH TERSISA - EKSPLORASI MENDALAM

### CRITICAL PRIORITY

**1. Website - GitHub API References (brand leak)**

| File | Masalah | Aksi |
|------|---------|------|
| `packages/website/lib/community/fetch-github-star-count.ts` | Still pointing to `twentyhq/twenty` repo | Ganti ke `badesid/bades` |
| `packages/website/lib/releases/fetch-latest-release-tag.ts` | Still pointing to `twentyhq/twenty` repo | Ganti ke `badesid/bades` |

**2. Website - Terminal/UI Brand Strings**

| File | Masalah | Aksi |
|------|---------|------|
| `packages/website/src/sections/AppPreview/AppWindow/AppWindow.tsx` | `WINDOW_ID = 'twenty-app-window'` | Ganti ke `bades-app-window` |
| `packages/website/src/sections/AppPreview/Terminal/TerminalPrompt/components/TerminalPromptFooter.tsx` | `label="~/code/my-twenty-app"` | Ganti ke `my-bades-app` |
| `packages/website/src/sections/AppPreview/Terminal/TerminalEditor/utils/editor-explorer-nodes.ts` | `name: 'my-twenty-app'` | Ganti ke `my-bades-app` |
| `packages/website/src/sections/AppPreview/Terminal/TerminalTrafficLights/utils/terminal-traffic-light-constants.ts` | `TRAFFIC_LIGHTS_ESCAPE_EVENT = 'twenty-traffic-lights-escape'` | Ganti nama event |
| `packages/website/src/sections/AppPreview/Terminal/TerminalDiff/diff-data.ts` | `my-twenty-app`, `schema-identifiers.ts`, `rocket.object.ts` | Ganti semua referensi |

**3. Seed Data - Non-SID Items (harus dihapus)**

| File | Masalah | Aksi |
|------|---------|------|
| `dev-seeder/data/constants/pet-data-seeds.constant.ts` | Toby the Dog, Brad Pitt reference, US addresses | HAPUS atau KONVERSI |
| `dev-seeder/data/constants/rocket-data-seeds.constant.ts` | Falcon 9, Starship, Falcon Heavy | HAPUS |
| `dev-seeder/data/constants/survey-result-data-seeds.constant.ts` | "People who like cats", US surveys | HAPUS |
| `dev-seeder/data/constants/pet-care-agreement-data-seeds.constant.ts` | Pet care agreement | HAPUS |
| `dev-seeder/metadata/custom-objects/constants/pet-custom-object-seed.constant.ts` | Pet custom object | HAPUS |
| `dev-seeder/metadata/custom-objects/constants/rocket-custom-object-seed.constant.ts` | Rocket custom object | HAPUS |
| `dev-seeder/metadata/custom-objects/constants/survey-results-object-seed.constant.ts` | Survey custom object | HAPUS |
| `dev-seeder/metadata/custom-objects/constants/pet-care-agreement-custom-object-seed.constant.ts` | Pet care agreement object | HAPUS |

**4. Seed Data - English Names Generator**

| File | Masalah | Aksi |
|------|---------|------|
| `dev-seeder/core/utils/generate-random-users.util.ts` | FIRST_NAMES = ['James', 'Mary', 'John'...], LAST_NAMES = ['Smith', 'Johnson'...] | Ganti ke nama Indonesia |
| `dev-seeder/data/constants/calendar-event-participant-data-seeds.constant.ts` | Alex Johnson, Sarah Williams, Michael Chen, Emily Davis | Ganti ke nama Indonesia |
| `dev-seeder/data/constants/message-participant-data-seeds.constant.ts` | Alex Johnson, Sarah Williams, Michael Chen, Emily Davis + John Smith | Ganti ke nama Indonesia |

**5. Translations - AI Prompt Templates (CRM context)**

| File:Line | msgid | Masalah |
|-----------|-------|---------|
| id-ID.po:1497 | "Build a dashboard that shows: total pipeline value by stage..." | Ganti "pipeline" → "alur layanan" |
| id-ID.po:2277 | "deal value by pipeline stage" | Ganti ke istilah SID |
| id-ID.po:4374 | "number of new leads by source..." | Ganti "leads" → konteks SID |
| id-ID.po:5112 | "Log a new deal (company, amount, stage..." | Ganti "deal" → "permohonan" |
| id-ID.po:9281-9288 | "When a deal's stage changes to Closed Won..." | Ganti ke "Disetujui"/"Ditolak" |

**6. Translations - Impersonation Strings (half-translated)**

| File:Line | Masalah |
|-----------|---------|
| id-ID.po:1656 | `Cannot impersonate selected user` - not translated |
| id-ID.po:4458-4464 | `Impersonate workspace users` - not translated |
| id-ID.po:4851-4855 | `Logged in as {impersonatedUser}` - not translated |
| id-ID.po:5121 | `Stop impersonating` - partially translated |

---

### HIGH PRIORITY

**7. Website - CRM Terminology in Content**

| File | Masalah |
|------|---------|
| `packages/website/src/app/[locale]/(home)/page.tsx` | Pipeline terminology masih ada di feature data |
| `packages/website/src/app/[locale]/(home)/app-preview.data.ts` | `pipeline-health`, `'Send email sequence when deal is engaged'` |
| `packages/website/src/app/[locale]/(home)/feature.data.ts` | `your pipeline reflects village reality` |
| `packages/website/src/app/[locale]/(home)/ai-hero-tabs.data.ts` | `Show me all deals closing this month` |
| `packages/website/src/content/site/asset-patars.ts` | `SHARED_COMPANY_LOGO_URLS_BY_DOMAIN` - tech company logos |
| `packages/website/src/customers/elevate-consulting/page.tsx` | "client and opportunity data", "proposal is won" |
| `packages/website/src/customers/netzero/page.tsx` | "multinational pipeline", "second CRM in parallel" |

**8. Seed Data - Workspace ID Constants**

| File | Masalah | Aksi |
|------|---------|------|
| `dev-seeder/core/constants/seeder-workspaces.constant.ts` | `SEED_APPLE_WORKSPACE_ID`, `SEED_YCOMBINATOR_WORKSPACE_ID` - constant names CRM | Ganti ke `SEED_SUKAMAJU_WORKSPACE_ID`, `SEED_MEKARSARI_WORKSPACE_ID` |
| isi displayName sudah "Desa Sukamaju", "Desa Mekar Sari" | GOOD | - |

**9. Seed Data - Legacy CRM Objects (rename)**

| File | Masalah | Aksi |
|------|---------|------|
| `dev-seeder/data/constants/company-data-seeds.constant.ts` | Konsep `company` sebagai padanan "lembaga desa" | Rename object atau mapping yang jelas |
| `dev-seeder/data/constants/person-data-seeds.constant.ts` | Konsep `person` sebagai padanan "penduduk" | Consolidate dengan penduduk object |
| `dev-seeder/metadata/custom-objects/constants/employment-history-custom-object-seed.constant.ts` | employment-history - nama CRM legacy | Rename ke nama Indonesia yang sesuai |

---

### MEDIUM PRIORITY

**10. Website - CRM Comparison Content**

| File | Masalah |
|------|---------|
| `packages/website/src/app/[locale]/pricing/salesforce.data.ts` | Salesforce comparison dengan CRM terminology |
| `packages/website/src/testimonials.data.ts` | Justin Beadle: "nice than dealing with a Salesforce or a HubSpot" |

**11. Translations - Object Labels**

| File:Line | msgid | Masalah |
|-----------|-------|---------|
| id-ID.po:1383 | `Avatar file field not found for person object` | "person object" → "object penduduk" |
| id-ID.po:516 | `Add a new company we're in touch with...` | "company" → "lembaga" |
| id-ID.po:2280 | `Create a new contact and link them to a company` | Ganti ke konsep SID |

**12. Config - Package Name**

| File | Masalah |
|------|---------|
| `packages/create-twenty-app/` | Package name masih `create-twenty-app` - legacy name |
| root `package.json` workspaces list | Still includes `create-twenty-app` |

**13. Docs - Legacy References**

| File | Masalah |
|------|---------|
| `packages/docs/MIGRATION.md` | References `packages/twenty-docs/`, `packages/twenty-website/` |
| `packages/docs/docs.json` | Redirect rules ke `/user-guide/getting-started/what-is-twenty` |
| Doc filenames | `what-is-twenty.mdx`, `generate-quote-or-invoice-from-twenty.mdx`, dll |

---

### LOW PRIORITY / BACKLOG

**14. Website - Avatar & Company Logos**

| File | Masalah |
|------|---------|
| `packages/website/src/content/site/asset-paths.ts` | Western names: alexandre, anonymousAnna, benChestnut... |
| `SHARED_COMPANY_LOGO_URLS_BY_DOMAIN` | Tech company domain → logo mapping |

**15. Internal Identifiers (non-blocking, documented)**

- `isTwentyStandardApplication()` function name
- `TwentyORMModule`, `TwentyConfigModule` internal module names
- `allowRequestsToTwentyIcons` GraphQL schema field
- Generated SDK type files

---

## Summary Matrix

| Area | Status | High-Priority Items | Notes |
|------|--------|---------------------|-------|
| .github & contributor surface | DONE | - | |
| Package.json metadata | DONE | - | |
| Seed CRM removal (objects) | PARTIAL | Pet, Rocket, Survey, Pet-care objects belum di-hapus dari seeder | |
| Website Homepage | PARTIAL | Headline sudah Bades, tapi ada CRM terms lain di page.tsx dan app-preview data | |
| GitHub API references | **DONE** | fetch-github-star-count.ts, fetch-latest-release-tag.ts → badesid/bades | Brand leak FIXED |
| Terminal/UI brand strings | **DONE** | `twenty-app-window` → `bades-app-window`, `my-twenty-app` → `my-bades-app` | Brand leak FIXED |
| AI prompt translations | REMAINING | pipeline, deal, leads, Closed Won → perlu konversi SID | |
| Impersonation translations | REMAINING | Half-translated, beberapa still English | |
| English names in seeds | REMAINING | James, Mary, John... → perlu nama Indonesia | |
| Case study CRM copy | REMAINING | "opportunity", "prospect", "lead" di case studies | |
| Docs filenames | REMAINING | what-is-twenty.mdx → what-is-bades.mdx | |
| Pipeline terminology | REMAINING | "pipeline" di website content | |
| Non-SID seed objects | REMAINING | Pet, Rocket, Survey objects perlu dihapus dari seeder | |

---

## Next Steps Priority (untuk besok)

### CRITICAL (harus selesai besok):

1. ~~GitHub API URLs~~ - **DONE** ✓
2. ~~Terminal/UI Brand Strings~~ - **DONE** ✓
3. **Non-SID Seed Deletion** - Hapus dari dev-seeder:
   - Pet, Rocket, Survey, Pet-care agreement data + custom objects
   - Atau disable seeding-nya saja jika tidak来得及 hapus

4. **English Names → Indonesia** - Ganti di:
   - `generate-random-users.util.ts` - nama Indonesia
   - `calendar-event-participant-data-seeds.constant.ts`
   - `message-participant-data-seeds.constant.ts`

5. **AI Prompt Translations** - Konversi CRM terms ke SID:
   - "pipeline" → "alur layanan"
   - "deal" → "permohonan"
   - "Closed Won" → "Disetujui"
   - "leads" → konteks SID yang sesuai

6. **Impersonation Translations** - Lengkapi terjemahan:
   - `Cannot impersonate selected user`
   - `Impersonate workspace users`
   - `Logged in as {impersonatedUser}`
   - `Stop impersonating`

7. **Workspace ID Constants** - Rename:
   - `SEED_APPLE_WORKSPACE_ID` → `SEED_SUKAMAJU_WORKSPACE_ID`
   - `SEED_YCOMBINATOR_WORKSPACE_ID` → `SEED_MEKARSARI_WORKSPACE_ID`

8. **Docs Filename Rename** -:
   - `what-is-twenty.mdx` → `what-is-bades.mdx`
   - Update redirect di `docs.json`

### HIGH (delegasi besok):

- AI prompt translations: "pipeline" → "alur layanan", "deal" → "permohonan", "Closed Won" → "Disetujui"
- Impersonation translations: `Cannot impersonate selected user`, `Impersonate workspace users`, dll
- Workspace ID constants rename

### MEDIUM (minggu ini):

9. **Case Study CRM Copy** - Review dan konversi ke SID language
10. **Pipeline Terminology** - Ganti di website content
11. **create-twenty-app** - Consider rename atau leave as-is (internal tooling)

---

*Report generated dari autonomous team session + eksplorasi mendalam 2026-05-21*
*Tim eksplorasi: explorer-website, explorer-seed, explorer-translations, explorer-config, explorer-front-docs*
*Team work sebelumnya: operator-github-bades, pelaksana-front-bades, pelaksana-server-bades, lokalisasi-bades, penjaga-goal-bades, verifikator-bades*

---

# NIGHT SHIFT — 2026-05-21 (sesi otonom lanjutan)

Sesi ini melanjutkan clean up + refactor terarah. Semua perubahan **belum
di-commit** (kecuali yang sudah tergabung di commit `83d8feb2` oleh proses lain).

## 1. `.github` & metadata repo — SELESAI (dengan debt terdokumentasi)

Masalah inti yang ditemukan: **direktori dan nama proyek nx sudah di-rename**
(`packages/twenty-front` → `packages/front`, proyek `twenty-front` → `front`,
dst.), tetapi seluruh workflow `.github/workflows/*` masih memakai path dan
nama proyek lama. **CI praktis rusak total** sebelum sesi ini.

Diterapkan:
- Semua workflow (`ci-*.yaml`, `cd-*.yaml`, dll.) diperbaiki: path filter
  `packages/twenty-X/**` → `packages/X/**` dan referensi nx project
  `twenty-X` → `X` untuk front, server, shared, emails, ui, sdk, client-sdk,
  website, docs, zapier, e2e-testing, utils, front-component-renderer, docker,
  apps.
- `crowdin-app.yml`, `crowdin-docs.yml`, `crowdin-website.yml` — path package
  diperbaiki.
- `verdaccio-config.yaml` — nama package publish `twenty-sdk`/`twenty-client-sdk`/
  `create-twenty-app` → `sdk`/`client-sdk`/`create-bades-app`.
- `ci-create-app*.yaml` — CLI `npx twenty` → `npx bades`, npm package
  `create-twenty-app` → `create-bades-app`.
- `ci-test-docker-compose.yaml` — path docker diperbaiki.
- Semua file YAML divalidasi (0 invalid).
- File sampah `nul` (artefak Windows) dihapus.

Debt yang sengaja TIDAK disentuh (butuh verifikasi CI / berisiko):
- `twentyhq/twenty-infra` di `cd-deploy-*.yaml` & `i18n-*.yaml` — repo infra
  eksternal, kontrak teknis, tidak diubah.
- Identifier docker internal (`twenty-db-1`, `twenty-server-1`, target
  `twenty`, image `twenty-app-dev`) — tergantung konfigurasi docker-compose /
  Dockerfile, tidak user-facing.
- Email bot CI (`ci@twenty.com`, `github-action-deploy@twenty.com`),
  `twenty.api.crowdin.com` — kontrak akun eksternal.
- **PENTING**: direktori `packages/create-twenty-app` GAGAL di-rename ke
  `packages/create-bades-app` (Permission denied / file lock Windows).
  Akibatnya nama proyek nx (`create-bades-app`) ≠ nama direktori
  (`create-twenty-app`). Workflow `ci-create-app*` belum 100% konsisten sampai
  direktori ini di-rename. **Aksi besok**: rename direktori +
  update `package.json` workspaces, `project.json` cwd, oxlint
  `enforce-module-boundaries.ts`, config internal package.

## 2. README & metadata — SELESAI

- `README.md` ditulis ulang total. Sebelumnya: judul "SID Open Source",
  bagian besar berbahasa **Spanyol** (terjemahan rusak), framing developer
  platform (CLI scaffold, `bades-sdk/define`, `app:publish`), section
  Self-hosting menonjol. Sekarang: Bahasa Indonesia native, posisi sebagai
  layanan terkelola untuk perangkat desa non-teknis, tanpa narasi
  open-source/self-hosting-first, tanpa SDK sebagai pengalaman utama.
- `TERMINOLOGY.md` — perbaikan typo ("dariAjuan", "konteksagenda").

## 3. Seed data — SEBAGIAN SELESAI

- `generate-random-users.util.ts` — `FIRST_NAMES`/`LAST_NAMES` (nama Amerika)
  diganti daftar nama Indonesia (Jawa, Sunda, Batak). `locale: 'en'` → `'id-ID'`.
- `calendar-event-participant-data-seeds.constant.ts` &
  `message-participant-data-seeds.constant.ts` — `FAKE_PARTICIPANTS` /
  `FAKE_EMAIL_PARTICIPANTS` (Alex Johnson, Sarah Williams, dll.) diganti nama
  warga Indonesia + email wajar. `Workspace Member` → `Perangkat Desa`,
  `Person N` → `Warga N`.
- Konstanta `SEED_APPLE_WORKSPACE_ID` → `SEED_SUKAMAJU_WORKSPACE_ID` dan
  `SEED_YCOMBINATOR_WORKSPACE_ID` → `SEED_MEKARSARI_WORKSPACE_ID` di-rename
  konsisten di 19 file (src + test).

Debt seed yang masih tersisa:
- File seed non-SID (pet, rocket, survey, pet-care) — sudah tidak diimpor
  (terverifikasi), tetapi file constant-nya masih ada sebagai dead code. Aman
  dihapus pada sesi terfokus.

## 4. Terjemahan (`packages/front/src/locales/id-ID.po`)

Diperbaiki:
- 5 entri impersonation rusak/setengah-terjemah (termasuk yang punya quote
  liar / kata terpotong: `"top impersonating"`, `"Terakhir "10 users...`).
- Entri prompt AI dengan istilah `lead` → `prospek` + 1 entri otomasi yang
  sebelumnya tidak diterjemahkan sama sekali.
- **115 entri** dengan `msgstr` tanpa tanda kutip penutup → diperbaiki.

## ⚠️ TEMUAN KRITIS — `id-ID.po` RUSAK PARAH

`packages/front/src/locales/id-ID.po` mengalami **korupsi struktural skala
besar**: **389 entri** berpola `msgstr "Kata "sisa teks inggris"` — tanda
kutip dalam tidak di-escape DAN copy hanya diterjemahkan sebagian (kata
pertama saja, mis. `msgstr "Buat "a dashboard"`). Pola ini hampir pasti hasil
script terjemahan yang buruk.

Dampak: `lingui:compile` untuk frontend kemungkinan besar **gagal** → katalog
terjemahan Bahasa Indonesia tidak terbangun.

**Tidak diperbaiki pada sesi ini** karena: (a) butuh re-terjemah per entri,
bukan sekadar escape kutip; (b) mass-edit buta berisiko memperparah. **Aksi
besok**: sesi terfokus rebuild 389 entri dari `en.po` sebagai sumber, pakai
skill `lokalisasi-native-indonesia` / `rapikan-bahasa-indonesia`. Catatan:
`packages/emails/.../id-ID.po` dan `packages/server/.../i18n/locales/id-ID.po`
**bersih** (0 entri rusak) — masalah hanya di front.

## Area belum disentuh (debt besar, perlu sesi terfokus)

- **Docs (`packages/docs`)** — `docs.json` 6664 baris + ~15 mirror locale
  `l/<locale>/` + docs developer/self-host. Banyak slug `*-from-twenty`,
  `what-is-twenty`. Transformasi besar; rename slug harus serentak dengan
  semua mirror locale agar link tidak putus. Belum disentuh agar tidak
  meninggalkan link rusak.
- **Website content** — sedang dikerjakan agen background terpisah (home,
  product, why-bades). Customer case studies, release notes `.mdx`,
  `salesforce.data.ts` masih penuh istilah CRM — belum disentuh.
- **Settings & navigasi user-facing**, **billing Midtrans-first**,
  **platform surface (API key/webhook/app) → admin/internal** — belum
  disentuh sesi ini.
- Direktori nested aneh `packages/front/packages/front/src/locales/`
  (3 file tracked: `generated/en.ts`, `generated/id-ID.ts`, `translate.py`) —
  kemungkinan artefak salah copy saat rename. Perlu dikonfirmasi & dihapus.

## 5. Website — konten home/product (agen background) — SELESAI

Agen `pelaksana-front-bades` membersihkan terminologi CRM jadi konteks SID di
7 file: `(home)/app-preview.data.ts`, `(home)/page.tsx`,
`(home)/three-cards-illustration.data.ts`, `(home)/helped.data.ts`,
`product/feature.data.ts`, `product/ai-hero-tabs.data.ts`, `product/page.tsx`,
`why-bades/page.tsx`. Data demo CRM (Apple, Anthropic, Stripe, sales pipeline)
diganti data desa (Desa Suka Maju, warga + NIK, alur permohonan layanan).
Narasi open-source dihapus → "layanan terkelola". `tsc --noEmit` bersih untuk
file yang disentuh.

Bug rebrand yang ditemukan & diperbaiki sesi ini: find-replace
`Twenty` → `Bades.id` yang ceroboh menghasilkan **identifier tidak valid**:
- `getBades.idReactHeaderComment` → `getBadesReactHeaderComment`
  (`exporters.ts`, error kompilasi).
- `Pages.WhyBades.id` → `Pages.WhyBades` (`Heading.tsx`, error kompilasi).

Debt website tersisa (di luar scope agen):
- `product/three-cards.data.ts`, `sections/Faq` (`FAQ_QUESTIONS`),
  `(home)/testimonials.data.ts` — kemungkinan masih copy CRM/Inggris.
- `terms/_components/TermsDocument.tsx` — banyak `Bades.id.com PBC` (hasil
  replace ceroboh dari `twenty.com PBC`); butuh nama entitas hukum yang benar.
- Customer case studies & release notes `.mdx` — masih penuh istilah CRM.

*Night shift report — 2026-05-21, sesi otonom Claude Code.*

---

# NIGHT SHIFT — iterasi 2 (AI single-model surface)

Domain iterasi ini: **menghapus pemilih model AI dari surface user-facing**
sesuai rule `ai-single-model.md` (pengalaman AI = satu kapabilitas tunggal,
tanpa katalog model untuk user balai desa).

Sudah diterapkan & di-commit (`ebefe24c`):

- `AiChatEditorSection.tsx` — dropdown model di kolom chat AI dihapus. Chat
  kini selalu memakai model default workspace (request tanpa `modelId`
  eksplisit → backend pakai default).
- `SettingsAiAgentForm.tsx` (form buat agen) — select "AI Model" + blok
  `SettingsAgentModelCapabilities` dihapus. `modelId` default tetap `'auto'`
  (valid di schema), jadi agen baru otomatis pakai auto-select.
- `SettingsAgentSettingsTab.tsx` (edit agen) — select model + capabilities
  dihapus; `modelId` agen lama tetap dipertahankan apa adanya.
- `WorkflowAiAgentPromptTab.tsx` (aksi AI di workflow) — select model +
  capabilities dihapus.
- `SettingsAI.tsx` — tab **"Models"** (Smart/Fast model + tabel model
  tersedia) dihapus dari halaman Settings → AI. Default tab kini "Skills".
- Dead code dibersihkan: `SettingsAiModelsTab.tsx`,
  `SettingsAgentModelCapabilities.tsx`, `useAiModelOptions.ts` dihapus;
  konstanta tab `MODELS` dihapus.

Verifikasi: `npx nx typecheck front` **lulus**. Tidak ada referensi
menggantung ke simbol yang dihapus.

Catatan arsitektur (sesuai model tiga lapisan GOAL):
- Konfigurasi model tetap ada di **admin panel** (`SettingsAdminAI`,
  `SettingsAdminNewAiModel`) — itu lapisan admin/internal yang benar, sengaja
  tidak disentuh.
- `agentChatUserSelectedModelState` kini tidak pernah di-set lagi (hanya
  dibaca `useAgentChatModelId` dengan nilai default). Tidak rusak, hanya
  sedikit redundan — bisa disederhanakan di sesi lain.

Debt AI tersisa:
- `SettingsAiModelsTable` masih dipakai admin panel (benar, biarkan).
- Halaman Settings → AI masih punya tab Skills/Tools/Usage/More yang cukup
  bernuansa developer-platform — kandidat untuk dievaluasi pindah ke lapisan
  admin/internal pada sesi terpisah.

Catatan koordinasi: terdeteksi proses paralel lain sedang me-rename
`packages/server/src/engine/sid-orm` (`twenty-orm` → `sid-orm`). Area itu
tidak disentuh sesi ini untuk menghindari tabrakan file.

*Night shift iterasi 2 — 2026-05-21, sesi otonom Claude Code.*

---

# NIGHT SHIFT — iterasi 3 (perbaikan korupsi id-ID.po)

Domain iterasi ini: **memperbaiki korupsi katalog terjemahan
`packages/front/src/locales/id-ID.po`** — temuan kritis dari iterasi 1.

Masalah: 434 entri `msgstr` rusak dengan pola `"Kata "sisa teks Inggris"`
(tanda kutip dalam tidak di-escape + hanya kata pertama yang diterjemahkan).
Akibatnya `lingui:compile` front gagal → seluruh katalog Bahasa Indonesia
tidak terbangun.

Sudah diterapkan:
- Ke-434 entri rusak diterjemahkan ulang **penuh ke Bahasa Indonesia native**
  langsung dari `msgid` sumber (bukan sekadar escape kutip). Placeholder
  (`{filename}`, `{0}`, `${monthlyPrice}`, dll.) dipertahankan utuh.
- Istilah disesuaikan: workflow → alur kerja, dashboard → dasbor,
  API key → kunci API, record → rekaman, field → kolom, dll.

Verifikasi:
- Validasi struktural `.po`: **0 error** (sebelumnya 434 entri rusak).
- `npx nx run front:lingui:compile`: **lulus** ("Compiling message
  catalogs… Done!") — katalog terjemahan front kini terbangun normal.

Catatan: file `.po` lain (`packages/emails`, `packages/server` i18n) sudah
bersih sejak awal — tidak perlu disentuh.

Debt terjemahan tersisa:
- Masih mungkin ada entri yang terjemahannya kaku/istilah CRM (mis. prompt AI
  contoh) — itu polish bahasa, bukan korupsi struktural. Bisa disisir pada
  iterasi lokalisasi berikutnya.

*Night shift iterasi 3 — 2026-05-22, sesi otonom Claude Code.*

---

# NIGHT SHIFT — iterasi 4 (surface platform → internal/admin)

Domain iterasi ini: **mengeluarkan surface developer-platform dari navigasi
settings pengguna utama**, sesuai GOAL (model tiga lapisan; app system =
kapabilitas internal tim Bades, bukan workflow self-service perangkat desa).

Sudah diterapkan di `packages/front/src/modules/settings/hooks/useSettingsNavigationItems.tsx`:
- Menu **`Apps`** (sistem aplikasi/app platform) — `isHidden: true`.
  Sebelumnya tampil ke pengguna dengan permission `APPLICATIONS` + badge "new".
  Route tetap ada untuk tim internal; hanya dilepas dari navigasi pengguna.
- Menu **`Updates`** (update/release center) — `isHidden: true`.
  Update center adalah workflow operasional tim Bades pada layanan terkelola,
  bukan bagian pengalaman pengguna balai desa.
- Menu `APIs & Webhooks` sudah `isHidden: true` sejak sebelumnya — sesuai.

Verifikasi:
- `nx typecheck front`: **lulus**.
- Logika test `useSettingsNavigationItems.test.tsx` (`every(isHidden)` saat
  tanpa permission, `some(!isHidden)` saat ada permission) tetap konsisten
  dengan perubahan ini.

Debt yang ditemukan (PRE-EXISTING, bukan regresi iterasi ini):
- `useSettingsNavigationItems.test.tsx` — ketiga test **sudah gagal di commit
  `ebefe24c`** (sebelum perubahan apa pun sesi ini; diverifikasi via
  `git stash`). Gejala: `result.current.find(s => s.label === 'Workspace'/'User')`
  mengembalikan `undefined` → kemungkinan masalah resolusi katalog lingui di
  environment test. Perlu sesi terfokus terpisah; bukan regresi dari pekerjaan
  transformasi.

Catatan arsitektur: langkah ini "mengeluarkan dari surface utama" (GOAL).
Relokasi penuh `Apps`/`Updates` ke dalam Admin Panel sebagai sub-halaman
internal adalah follow-up yang lebih besar — belum dikerjakan.

*Night shift iterasi 4 — 2026-05-22, sesi otonom Claude Code.*

---

# NIGHT SHIFT — iterasi 5 (perbaikan verifikasi yang gagal)

Domain iterasi ini: **memperbaiki test yang gagal** —
`useSettingsNavigationItems.test.tsx` (test untuk file yang disentuh
iterasi 4).

Diagnosis: ketiga test gagal karena meng-assert label section dalam Bahasa
Inggris (`'Workspace'`, `'User'`), padahal katalog lingui produk kini
mengembalikan Bahasa Indonesia. Debug membuktikan label aktual:
`["Pengguna","Ruang kerja","Lainnya"]`. Jadi test sekadar **usang** terhadap
arah Bades yang sudah Bahasa Indonesia native — bukan bug produk.

Diterapkan:
- Assertion label test diperbarui: `'Workspace'` → `'Ruang kerja'`,
  `'User'` → `'Pengguna'`.

Verifikasi:
- `npx jest useSettingsNavigationItems.test.tsx`: **3/3 lulus**.
- Sekaligus mengonfirmasi perubahan iterasi 4 (Apps/Updates disembunyikan)
  benar: assertion `every(isHidden)` dan `some(!isHidden)` terpenuhi.

Catatan: pola "test meng-assert label Inggris" kemungkinan ada di test front
lain. Dicatat sebagai debt untuk sisir terpisah.

*Night shift iterasi 5 — 2026-05-22, sesi otonom Claude Code.*

---

# RENCANA PRODUCTION-READY — FASE 1 SELESAI

Rencana lengkap 7 fase ada di
`C:\Users\hi\.claude\plans\aku-mau-anda-bekerja-clever-truffle.md`.
Target: codebase deployable + GOAL inti user-facing tuntas; billing migrasi
penuh ke Midtrans; docs ditunda.

## Fase 1 — SELESAI & TER-PUSH (commit `2271ee0b`, `d4de4a2c`)

- Rename `twenty-orm` → `sid-orm` di server dituntaskan & di-commit.
- **83 error typecheck server diperbaiki** (pre-existing, akibat rebrand seed
  tak tuntas): nama member seed `JANE/JONY/PHIL/TIM` → `KADES/SEKDES/KAUR/KASI`
  di ~21 file; locale test `fr-FR/de-DE/es-ES` → `id-ID`; perbaikan tipe
  `ClientConfig`, `LicenseObject`, `person-data-seeds`.
- Verifikasi: `nx typecheck server` **lulus**, `nx typecheck front` **lulus**.
- Seluruh baseline (145 file) di-commit dalam 2 commit logis & di-push ke
  `rebrand-bades`.

## Sisa fase (belum dikerjakan)

- **Fase 2 — Migrasi billing Stripe → Midtrans**: pekerjaan TERBESAR
  (modul Midtrans baru, SDK Snap, entity + migrasi DB, webhook
  `/webhooks/midtrans`, feature flag, frontend billing). Estimasi besar
  (setara berminggu-minggu); butuh akun/kredensial Midtrans sandbox untuk
  verifikasi end-to-end.
- **Fase 3 — Docker & CI**: path `twenty-server` di `docker-compose.yml`,
  label Dockerfile.
- **Fase 4 — Brand/CRM/self-hosting leak user-facing**: `asset-paths.ts`,
  `next.config.ts`, narasi self-hosting di website locale, istilah CRM di
  `id-ID.po`, hapus seed legacy pet/rocket/survey.
- **Fase 5 — Perbaikan test front**: jalankan `nx test front`, perbaiki test
  usang (assert label Inggris) vs regresi.
- **Fase 6 — Developer surface**: konfirmasi nav, dll.
- **Fase 7 — Verifikasi penuh & push final**.

*Fase 1 production-ready — 2026-05-22, sesi otonom Claude Code.*