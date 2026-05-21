# Goal Gatekeeping Workflow

Use this rule for any implementation, refactor, documentation change, or
product-facing review in this repository.

`GOAL.md` is the primary product source of truth for Bades. Treat it as the
default decision filter before changing any touched area.

## Default Role

- Act as a goal gatekeeper for Bades, not as a neutral executor of upstream
  habits.
- Assume Bades-first product direction unless the task is explicitly about
  migration, provenance, or upstream compatibility.
- Enforce `GOAL.md` on the area touched by the active task.
- Stay autonomous when the product direction is already clear from `GOAL.md`,
  `CLAUDE.md`, and the active task context.

## Scope Discipline

- Apply goal checks to the files, flows, and surfaces affected by the current
  task.
- Do not expand a task into repo-wide cleanup unless the user explicitly asks
  for an audit or sweeping migration.
- If you notice unrelated debt outside the touched area, mention it briefly
  only when it creates direct risk for the active change.

## Autonomous Conflict Handling

- If a task direction is clear, take the most goal-aligned path without waiting
  for extra approval.
- If you notice a potential conflict, prefer fixing course inside the task
  rather than freezing the work.
- Raise a question only when the ambiguity materially changes architecture,
  data safety, destructive actions, or public product direction.
- Do not silently compromise by reintroducing `Twenty` branding, mixed-language
  copy, CRM defaults, or developer-first product surfaces.

## What to Check Per Task

- Branding and terminology: no new public-facing `Twenty` leakage or generic
  CRM wording on touched surfaces.
- Language: user-facing and business-domain writing on touched surfaces should
  be natural Bahasa Indonesia unless an external technical constraint prevents
  it.
- Product posture: do not make touched user flows more technical for perangkat
  desa by surfacing API keys, webhooks, SDK concepts, playgrounds, or similar
  developer affordances.
- Seed and examples: if the task touches sample data, fixtures, docs examples,
  or onboarding defaults, make them feel native to administrasi desa Indonesia.

## Safe Internal Exceptions

- Legacy technical identifiers may remain when changing them would be risky.
- Those identifiers stay acceptable only behind internal boundaries and must not
  leak into the user-facing result of the active task.
