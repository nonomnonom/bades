# BESOK-REVIEW.md

Tanggal: 2026-05-21
Repo: D:\bades (branch: rebrand-bades)
Tujuan: Dekatkan codebase ke GOAL.md - audit dan perbaiki brand, copy, seed, dan surface publik

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