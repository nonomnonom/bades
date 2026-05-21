---
paths:
  - "packages/website/src/content/releases/**/*.mdx"
  - "packages/website/public/images/releases/**"
---

# Bades Release Changelog Process

Use this rule when editing release content for the website package.

## Locations

- Changelog content: `packages/website/src/content/releases/{VERSION}.mdx`
- Release images: `packages/website/public/images/releases/{MINOR_VERSION}/`

## Content Rules

- Write public-facing release notes as **Bades**.
- Do not frame product updates as "Twenty features" unless the note is
  explicitly about technical provenance or upstream sync.
- Highlight user impact, workflow impact, and administrator impact clearly.
- Keep terminology aligned with Bades product language and Indonesian village
  administration where relevant.

## Research Workflow

```bash
git log --since="2 weeks ago" --oneline --no-merges
rg -n "feature-keyword" packages/front packages/server packages/website
git log --since="2 weeks ago" --oneline -- packages/front/src
git log --since="2 weeks ago" --oneline -- packages/server/src
```

## Asset Workflow

```bash
mkdir -p packages/website/public/images/releases/{MINOR_VERSION}
```

- Keep filenames versioned and descriptive.
- Ensure screenshots and mockups reflect Bades branding, not legacy Twenty
  visuals.
