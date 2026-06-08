/**
 * React Doctor configuration.
 *
 * React Doctor scans the entire monorepo by default and applies React-specific
 * rules (rules-of-hooks, no-adjust-state-on-prop-change, etc.) to all *.ts/*.tsx
 * files. NestJS server code in packages/server/ uses "use"-prefixed functions
 * that are GraphQL Yoga plugins — not React hooks — causing false positives.
 *
 * Docs: https://www.react.doctor/ci
 */
export default {
  ignore: {
    files: [
      // NestJS server — bukan kode React, semua React rules adalah false positive
      'packages/server/**/*',
    ],
  },
};
