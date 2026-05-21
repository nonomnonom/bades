import { t } from '@lingui/core/macro';

export const getStandardApplicationDescription =
  (): string => t`The base data model every Bades.id workspace runs on.

#### What "foundation" means

Every Bades.id workspace starts with this set of objects. They define the shape of your Village Information System, including residents, services, and administration. Everything else, including marketplace apps, AI agents, and custom objects, plugs into them.

#### Included objects
- **Residents & Families**: citizen and household records
- **Service Requests**: your village service pipeline
- **Letters & Documents**: administrative paperwork and follow-ups
- **Budgets & Assistance**: village planning and social programs

Remove this app and the rest of Bades.id has nothing to hang off.

#### Build your own app

Extend Bades.id with your own objects, fields, logic functions, or AI skills. Scaffold a new app in one command:

\`\`\`bash
npx create-bades-app@latest my-bades-app
\`\`\`

Then inside the folder:

\`\`\`bash
cd my-bades-app
yarn bades dev
\`\`\`

See the [Getting Started guide](https://bades.id/developers/extend/apps/getting-started) for the full walkthrough, and [Building Apps](https://bades.id/developers/extend/apps/building) for the \`defineApplication\` / \`defineEntity\` APIs.`;
