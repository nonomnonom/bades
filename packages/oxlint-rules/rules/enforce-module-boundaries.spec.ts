import { RuleTester } from 'oxlint/plugins-dev';

import { rule, RULE_NAME } from './enforce-module-boundaries';

const depConstraints = [
  {
    sourceTag: 'scope:frontend',
    onlyDependOnLibsWithTags: ['scope:shared', 'scope:frontend'],
  },
  {
    sourceTag: 'scope:backend',
    onlyDependOnLibsWithTags: ['scope:shared', 'scope:backend'],
  },
  {
    sourceTag: 'scope:shared',
    onlyDependOnLibsWithTags: ['scope:shared'],
  },
];

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: "import { isDefined } from 'shared';",
      options: [{ depConstraints }],
      filename: '/project/packages/front/src/utils.ts',
    },
    {
      code: "import { Button } from 'ui';",
      options: [{ depConstraints }],
      filename: '/project/packages/front/src/components.tsx',
    },
    {
      code: "import { isDefined } from 'shared';",
      options: [{ depConstraints }],
      filename: '/project/packages/server/src/utils.ts',
    },
    {
      code: "import { helper } from './local';",
      options: [{ depConstraints }],
      filename: '/project/packages/front/src/utils.ts',
    },
    {
      code: "import lodash from 'lodash';",
      options: [{ depConstraints }],
      filename: '/project/packages/front/src/utils.ts',
    },
    {
      code: "import { isDefined } from 'shared';",
      options: [{ depConstraints: [] }],
      filename: '/project/packages/front/src/utils.ts',
    },
  ],
  invalid: [
    {
      code: "import { ServerService } from 'server';",
      options: [{ depConstraints }],
      filename: '/project/packages/front/src/bad-import.ts',
      errors: [{ messageId: 'moduleBoundaryViolation' }],
    },
    {
      code: "import { Component } from 'front';",
      options: [{ depConstraints }],
      filename: '/project/packages/server/src/bad-import.ts',
      errors: [{ messageId: 'moduleBoundaryViolation' }],
    },
    {
      code: "import { Component } from 'front';",
      options: [{ depConstraints }],
      filename: '/project/packages/shared/src/bad-import.ts',
      errors: [{ messageId: 'moduleBoundaryViolation' }],
    },
    {
      code: "import { ServerThing } from 'server';",
      options: [{ depConstraints }],
      filename: '/project/packages/shared/src/bad-import.ts',
      errors: [{ messageId: 'moduleBoundaryViolation' }],
    },
  ],
});
