import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { pathsToModuleNameMapper } from 'ts-jest';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsConfigPath = resolve(__dirname, './tsconfig.json');
const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf8'));

// oxlint-disable-next-line no-undef
process.env.TZ = 'Asia/Jakarta';
// oxlint-disable-next-line no-undef
process.env.LC_ALL = 'id_ID.UTF-8';
// oxlint-disable-next-line no-undef
process.env.LANG = 'id_ID.UTF-8';
const jestConfig = {
  // For more information please have a look to official docs https://jestjs.io/docs/configuration/#prettierpath-string
  // Prettier v3 will should be supported in jest v30 https://github.com/jestjs/jest/releases/tag/v30.0.0-alpha.1
  prettierPath: null,
  displayName: 'bades-front',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['./setupTests.ts'],
  testEnvironment: 'jsdom',
  // Hindari jsdom memprioritaskan `module`/`browser` exports yang ESM-only
  // (mis. transliteration) — paksa jest pakai node CJS entries.
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(apollo-upload-client|extract-files|is-plain-obj)/.*)',
    '../../node_modules/(?!(apollo-upload-client|extract-files|is-plain-obj)/.*)',
  ],
  transform: {
    '^.+\\.(ts|js|tsx|jsx|mjs)$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg|svg\\?react)$':
      '<rootDir>/__mocks__/imageMockFront.js',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  coverageThreshold: {
    global: {
      statements: 47.0,
      lines: 45.5,
      functions: 39.5,
    },
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'states/.+State.ts$',
    'states/selectors/*',
    'contexts/.+Context.ts',
    'testing/*',
    'tests/*',
    'config/*',
    'graphql/queries/*',
    'graphql/mutations/*',
    'graphql/subscriptions/*',
    'graphql/fragments/*',
    'types/*',
    'constants/*',
    'generated-metadata/*',
    'generated/*',
    '__stories__/*',
    'display/icon/index.ts',
  ],
  coverageDirectory: './coverage',
  maxWorkers: 3,
  workerIdleMemoryLimit: '512MB',
  errorOnDeprecated: true,
};

export default jestConfig;
