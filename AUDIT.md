# Rebrand Bades - Audit Report

**Branch**: `rebrand-bades`
**Baseline commit**: `3af534c9` - "refactor: set Indonesian as primary language, English as secondary"
**Last Updated**: 2026-05-21

## User-Facing Packages

| Package | Role | User-Facing |
|--------|------|-------------|
| `front` | React CRM frontend | ✅ Yes |
| `server` | NestJS backend API | ⚙️ API only |
| `emails` | Email templates | ✅ Yes |
| `website` | Next.js marketing site | ✅ Yes |
| `docs` | Mintlify documentation | ✅ Yes |
| `ui` | Shared UI components | Internal |
| `shared` | Common types/utilities | Internal |
| `create-twenty-app` | CLI scaffolding | ✅ Yes |

## Completed Actions ✅

### Brand Assets (Phase 4)
- [x] `packages/front/public/bd.svg` - Main Bades logo
- [x] `packages/front/public/favicon.svg` - Favicon SVG
- [x] `packages/front/public/images/icons/icon-{16,32,48,64,128,192,256,512}.png` - Icon set (via sharp)
- [x] `packages/front/public/favicon.png` - Favicon PNG
- [x] `packages/front/public/images/app-icon.png` - App icon (192x192)
- [x] `packages/front/public/images/app-icon-512.png` - App icon (512x512)
- [x] `packages/front/public/images/logo-bar.png` - Logo bar (120x120)
- [x] `packages/companion/src/assets/bades-logo.svg` - Companion logo SVG
- [x] `packages/companion/src/assets/bades-logo-256.png` - Companion logo PNG
- [x] `packages/website/public/images/shared/companies/logos/twenty.svg` - Replaced with bades logo
- [x] `scripts/generate-brand-assets.py` - Brand asset generator script

### Localization (Phase 2)
- [x] `packages/front/src/modules/settings/data-model/fields/forms/utils/errorMessages.ts` - Translated to Indonesian
- [x] `packages/front/src/locales/id-ID.po` - Fixed corrupted translations (900+ strings)
- [x] Date format changed from `d MMM, yyyy` to `DD/MM/YYYY` per GOAL.md

### Email Templates (Phase 1)
- [x] `packages/emails/src/components/Logo.tsx` - Updated logo URL to bades.id
- [x] `packages/emails/src/components/Footer.tsx` - Rewritten with Bades branding and Indonesian text
- [x] `packages/emails/src/components/WhatIsTwenty.tsx` → `WhatIsBades.tsx`
- [x] `packages/emails/src/constants/DefaultWorkspaceLogo.ts` - Updated placeholder URL
- [x] All 8 email templates updated with Indonesian content and bades.id references
- [x] `packages/emails/src/locales/id-ID.po` - Updated with Indonesian translations

### Seed Data (Phase 3)
**Objects Created:**
- [x] `packages/server/src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/penduduk-custom-object-seed.constant.ts` - Penduduk object (27 fields)
- [x] `packages/server/src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/keluarga-custom-object-seed.constant.ts` - Kartu Keluarga object
- [x] `packages/server/src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/jenis-surat-custom-object-seed.constant.ts` - Jenis Surat object
- [x] `packages/server/src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/permohonan-surat-custom-object-seed.constant.ts` - Permohonan Surat object

**Fields Created:**
- [x] `keluarga-custom-field-seeds.constant.ts` - 17 fields
- [x] `jenis-surat-custom-field-seeds.constant.ts` - 7 fields
- [x] `permohonan-surat-custom-field-seeds.constant.ts` - 8 fields

**Data Seeds:**
- [x] `keluarga-data-seeds.constant.ts` - 3 KK records
- [x] `jenis-surat-data-seeds.constant.ts` - 5 jenis surat
- [x] `permohonan-surat-data-seeds.constant.ts` - 3 permohonan records

**Registered in Services:**
- [x] `dev-seeder-metadata.service.ts` - All SID objects registered
- [x] `dev-seeder-data.service.ts` - All SID data seeds registered

**Bades SID 6 Domains Progress:**
| Domain | Objects | Status |
|--------|---------|--------|
| Demografi & Wilayah | Penduduk, Kartu Keluarga | ✅ Done |
| Pelayanan Surat | Jenis Surat, Permohonan Surat | ✅ Done |
| Pemerintahan Desa | - | TODO |
| Keuangan Desa | - | TODO |
| Program Sosial | - | TODO |
| Aset & Ekonomi | - | TODO |

### Website Marketing (Phase 5)
- [x] `packages/website/src/sections/Footer/data.ts` - Full rebrand
- [x] `packages/website/src/sections/Menu/data.ts` - Updated links and text
- [x] `packages/website/src/sections/Hero/components/ProductVisual/product-visual.data.tsx` - Village admin content
- [x] Release notes: 2.0.0.mdx, 0.31.0.mdx - "Twenty" → "Bades.id"

### Cursor Rules & Claude Skills
- [x] `.cursor/rules/*.mdc` - All 9 rules updated with "Twenty CRM" → "Bades.id"
- [x] `packages/claude-skills/README.md` - Updated
- [x] `packages/claude-skills/skills/twenty-record-presentation/SKILL.md` - Updated

### Docker & Infrastructure
- [x] `packages/utils/setup-dev-env.sh` - Updated header
- [x] `packages/docker/helm/twenty/README.md` - Updated
- [x] `packages/docker/k8s/README.md` - Partial update

### MCP Server
- [x] `packages/server/src/engine/api/mcp/constants/mcp-server-instructions.const.ts` - "Twenty CRM" → "Bades.id"

### Other Packages Updated
- [x] `packages/zapier/src/authentication.ts` - Updated workspace links
- [x] `packages/companion/README.md` - Updated
- [x] `packages/companion/src/main.js` - Bades logo assets, all Twenty references updated
- [x] `packages/apps/internal/twenty-slack` - README & configs updated
- [x] `packages/apps/internal/twenty-discord` - README & configs updated
- [x] `packages/apps/internal/twenty-fireflies` - README & configs updated
- [x] `packages/apps/internal/twenty-linear` - README & configs updated
- [x] `packages/apps/internal/twenty-for-twenty` - README & configs updated
- [x] `packages/apps/internal/call-recording` - README updated
- [x] `packages/apps/internal/exa` - README & configs updated
- [x] `packages/apps/internal/self-hosting` - README updated
- [x] `packages/apps/community/github-connector` - README & configs updated
- [x] `packages/apps/examples/hello-world` - README updated
- [x] `packages/apps/examples/postcard` - README & configs updated
- [x] `packages/create-twenty-app/README.md` - Updated
- [x] `packages/sdk/README.md` - Updated
- [x] `packages/client-sdk` - Partial update (generated files)
- [x] `packages/front/src/locales/translate.py` - Updated

## Remaining Work

### Critical (Seed Data - Large Effort)
1. [ ] **Remaining SID domains** - Pemerintahan Desa, Keuangan Desa, Program Sosial, Aset & Ekonomi
2. [ ] **Relations** - Link Penduduk to Kartu Keluarga, Permohonan to Jenis Surat and Penduduk

### Lower Priority (Internal Identifiers)
The following are internal code identifiers, not user-facing strings:
- `isTwentyStandardApplication()` function name
- `allowRequestsToTwentyIcons` GraphQL schema field
- `TwentyORMModule`, `TwentyConfigModule` internal module names
- `docker/k8s/terraform` infrastructure files
- Generated SDK type files (`client-sdk/src/metadata/generated/`)

## URLs Replaced

| From | To |
|------|-----|
| `app.twenty.com` | `app.bades.id` |
| `docs.twenty.com` | `docs.bades.id` |
| `github.com/twentyhq/twenty` | `github.com/badesid/bades` |
| `twenty.com` | `bades.id` |

## Entry Points

- **Frontend**: `packages/front/src/index.tsx`
- **Server**: `packages/server/src/main.ts`
- **Emails**: `packages/emails/src/`
- **Website**: `packages/website/src/app/[locale]/`
- **Docs**: `packages/docs/`