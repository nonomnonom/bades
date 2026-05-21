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

### Email Templates (Phase 1)
- [x] `packages/emails/src/components/Logo.tsx` - Updated logo URL to bades.id
- [x] `packages/emails/src/components/Footer.tsx` - Rewritten with Bades branding and Indonesian text
- [x] `packages/emails/src/components/WhatIsTwenty.tsx` - Deleted, replaced with `WhatIsBades.tsx`
- [x] `packages/emails/src/constants/DefaultWorkspaceLogo.ts` - Updated placeholder URL
- [x] All 8 email templates updated with Indonesian content and bades.id references
- [x] `packages/emails/src/locales/id-ID.po` - Updated with Indonesian translations
- [x] `lingui compile` ran successfully

### Localization (Phase 2)
- [x] `packages/front/src/modules/settings/data-model/fields/forms/utils/errorMessages.ts` - Translated to Indonesian

### Seed Data (Phase 3 - Partial)
- [x] `packages/server/src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant.ts`
  - Apple → Desa Sukamaju
  - YCombinator → Desa Mekar Sari
  - Logo URLs updated to bades.id
  - Empty workspaces renamed to Desa empty3/empty4

### Website Marketing (Phase 5 - In Progress)
- [x] `packages/website/src/sections/Footer/data.ts` - Full rebrand
- [x] `packages/website/src/sections/Menu/data.ts` - Updated links and text
- [x] `packages/website/src/sections/Hero/components/ProductVisual/product-visual.data.tsx` - Village admin content
- [x] `packages/website/src/app/[locale]/why-bades/page.tsx` - Fixed illustration path
- [x] `packages/website/src/app/[locale]/releases/page.tsx` - Updated CRM → SID, GitHub links
- [x] Halftone tool defaults: twenty-logo.svg → bades-logo.svg

### Other
- [x] `packages/zapier/src/authentication.ts` - Updated workspace links

## Remaining Work

### Critical (User-Facing)
1. [ ] **Seed data full replacement** - company/person/opportunity → Penduduk/Keluarga/Surat (large effort)
2. [ ] **Website product visual data** - More CRM references to replace
3. [ ] **Frontend validation schemas** - More error messages to translate
4. [ ] **Documentation paths** - docs.json has 50+ "twenty" references in URLs

### Medium Priority
1. [ ] **Test files** - client-config.service.spec.ts, two-factor-authentication.resolver.spec.ts
2. [ ] **Story/mock files** - Various story files with hardcoded URLs
3. [ ] **Apps/internal configs** - Internal dev configs

### Lower Priority
1. [ ] **Halftone tool** - Needs bades-logo.svg asset created
2. [ ] **Website SEO tests** - build-page-metadata.test.ts references

## Branding Strings Status

- 250+ files contain `Twenty` (pre-rebrand count)
- Critical user-facing files mostly updated
- Remaining work is scattered across many files

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