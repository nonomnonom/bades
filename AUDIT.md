# Rebrand Bades - Audit Report

**Branch**: `rebrand-bades`  
**Baseline commit**: `3af534c9` - "refactor: set Indonesian as primary language, English as secondary"

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

## Internal Packages

| Package | Role |
|--------|------|
| `companion` | Internal tooling |
| `oxlint-rules` | Linting rules |
| `utils` | Utility functions |
| `zapier` | Zapier integration |
| `claude-skills` | Claude integrations |
| `e2e-testing` | E2E tests |
| `front-component-renderer` | Component rendering |
| `client-sdk` | Client SDK |
| `sdk` | SDK |
| `cli` | CLI tools |
| `apps/*` | Internal apps |

## Browser Title (Warisan Twenty)

**File**: `packages/front/index.html` line 40
```html
<title>Twenty</title>
```

**File**: `packages/front/src/utils/title-utils.ts` line 57
```typescript
return 'Twenty'; // fallback default
```

**Action**: Ganti ke "Bades" atau "Bades.id - Sistem Informasi Desa"

## Favicon & App Icons

**Current locations**:
- `/images/icons/android/android-launchericon-48-48.png` (referenced in index.html)
- `packages/docs/favicon.png`
- `packages/website/src/app/favicon.ico`
- Example app icons di `packages/apps/examples/*/public/favicon.png`

**Source of truth**: `bd.svg` (root repo)

## SEO Metadata (index.html)

```html
<meta name="description" content="A modern open-source CRM" />
<meta property="og:description" content="A modern open-source CRM" />
<meta property="og:title" content="Twenty" />
<meta name="twitter:title" content="Twenty" />
<meta name="twitter:description" content="A modern open-source CRM" />
```

## Entry Points

- **Frontend**: `packages/front/src/index.tsx`
- **Server**: `packages/server/src/main.ts`
- **Emails**: `packages/emails/src/`
- **Website**: `packages/website/src/app/[locale]/`
- **Docs**: `packages/docs/`

## Branding Strings Found

- 250+ files mengandung `Twenty`
- Files critical user-facing:
  - `packages/front/index.html` - title, meta description, og tags
  - `packages/front/src/utils/title-utils.ts` - default title fallback
  - `packages/website/src/sections/Hero/` - Hero section
  - `packages/website/src/sections/Footer/data.ts` - Footer
  - `packages/emails/src/locales/*.po` - Email translations

## Next Steps

1. Ganti `<title>Twenty</title>` → `<title>Bades.id</title>` di index.html
2. Ganti meta description CRM → Deskripsi SID
3. Buat favicon dari `bd.svg`
4. Update OG/Twitter tags