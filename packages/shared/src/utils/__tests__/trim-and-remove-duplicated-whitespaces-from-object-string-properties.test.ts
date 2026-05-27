import { eachTestingContextFilter } from '@/testing';
import { type EachTestingContext } from '@/testing/types/EachTestingContext.type';
import { trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties } from '../trim-and-remove-duplicated-whitespaces-from-object-string-properties';
type SanitizeObjectStringPropertiesTestCase = EachTestingContext<{
  input: Record<string, any>;
  keys: string[];
  expected: Record<string, any>;
  extract?: boolean;
}>;

describe('trim-and-remove-duplicated-whitespaces-from-object-string-properties', () => {
  const testCases: SanitizeObjectStringPropertiesTestCase[] = [
    {
      title: 'should sanitize single string property',
      context: {
        input: { name: '  Budi   Santoso  ' },
        keys: ['name'],
        expected: { name: 'Budi Santoso' },
      },
    },
    {
      title: 'should sanitize multiple string properties',
      context: {
        input: {
          firstName: '  Budi  ',
          lastName: '  Santoso  ',
          email: '  budi.santoso@bades.id  ',
        },
        keys: ['firstName', 'lastName', 'email'],
        expected: {
          firstName: 'Budi',
          lastName: 'Santoso',
          email: 'budi.santoso@bades.id',
        },
      },
    },
    {
      title: 'should preserve undefined properties',
      context: {
        input: { name: '  Budi   Santoso  ' },
        keys: ['name', 'age'],
        expected: { name: 'Budi Santoso' },
      },
    },
    {
      title: 'should handle null properties',
      context: {
        input: { name: '  Budi   Santoso  ', description: null },
        keys: ['name', 'description'],
        expected: { name: 'Budi Santoso', description: null },
      },
    },
    {
      title: 'should not modify non-string properties',
      context: {
        input: { name: '  Budi   Santoso  ', age: 30, active: true },
        // In real life passing age would raise an TypeScript error
        keys: ['name', 'age', 'active'],
        expected: { name: 'Budi Santoso', age: 30, active: true },
      },
    },
    {
      title: 'should handle empty string',
      context: {
        input: { name: '   ' },
        keys: ['name'],
        expected: { name: '' },
      },
    },
    {
      title: 'should handle object with no properties to sanitize',
      context: {
        input: { age: 30, active: true },
        keys: ['name'],
        expected: { age: 30, active: true },
      },
    },
    {
      title: 'should handle nested whitespace',
      context: {
        input: { description: '  This   is   a   test  ' },
        keys: ['description'],
        expected: { description: 'This is a test' },
      },
    },
    {
      title: 'should trim only provided keys fields',
      context: {
        input: {
          name: '  Budi   Santoso  ',
          description: ' this      is a test   ',
        },
        keys: ['description'],
        expected: { name: '  Budi   Santoso  ', description: 'this is a test' },
      },
    },
    {
      title: 'should trim only provided keys fields and extract keys',
      context: {
        input: {
          name: '  Budi   Santoso  ',
          description: ' this      is a test   ',
        },
        keys: ['description'],
        expected: { description: 'this is a test' },
        extract: true,
      },
    },
  ];

  test.each(eachTestingContextFilter(testCases))(
    '$title',
    ({ context: { input, keys, expected, extract } }) => {
      const result =
        trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties(
          input,
          keys,
          extract,
        );

      expect(result).toEqual(expected);
    },
  );
});
