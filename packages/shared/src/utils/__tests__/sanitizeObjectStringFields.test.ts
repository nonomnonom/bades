import { eachTestingContextFilter } from '@/testing';
import { type EachTestingContext } from '@/testing/types/EachTestingContext.type';
import { extractAndSanitizeObjectStringFields } from '../extractAndSanitizeObjectStringFields';

type TestObject = {
  name?: string;
  age?: number | null;
  city?: string | undefined;
  description?: string;
  user?: {
    name: string;
    contact: {
      email: string;
    };
  };
  tags?: string[];
  items?: Array<{ name: string }>;
  mixedArray?: Array<string | number | null | { text: string }>;
};

type SanitizeTestCase = EachTestingContext<{
  input: {
    obj: TestObject;
    keys: (keyof TestObject)[];
  };
  expected: object;
}>;

describe('extractAndSanitizeObjectStringFields', () => {
  const testCases: SanitizeTestCase[] = [
    {
      title: 'should handle basic string properties and trim whitespaces',
      context: {
        input: {
          obj: { name: '  Budi   Santoso  ', age: 30 },
          keys: ['name', 'age'],
        },
        expected: { name: 'Budi Santoso', age: 30 },
      },
    },
    {
      title: 'should handle nested objects',
      context: {
        input: {
          obj: {
            user: {
              name: '  Siti   Maryam  ',
              contact: { email: '  siti@bades.id  ' },
            },
          },
          keys: ['user'],
        },
        expected: {
          user: {
            name: 'Siti Maryam',
            contact: { email: 'siti@bades.id' },
          },
        },
      },
    },
    {
      title: 'should skip undefined and null values',
      context: {
        input: {
          obj: { name: '  Budi  ', age: null, city: undefined },
          keys: ['name', 'age', 'city'],
        },
        expected: { name: 'Budi', age: null, city: undefined },
      },
    },
    {
      title: 'should handle empty object',
      context: {
        input: {
          obj: {},
          keys: ['name', 'age'],
        },
        expected: {},
      },
    },
    {
      title: 'should handle object with no matching keys',
      context: {
        input: {
          obj: { name: 'Budi', age: 30 },
          keys: ['city', 'name'],
        },
        expected: { name: 'Budi' },
      },
    },
    {
      title: 'should handle object with number field',
      context: {
        input: {
          obj: { name: 'Budi', age: 30 },
          keys: ['age', 'name'],
        },
        expected: { name: 'Budi', age: 30 },
      },
    },
    {
      title: 'should handle string with multiple spaces, tabs and newlines',
      context: {
        input: {
          obj: { description: 'This   is\t\ta\n\ntest    string' },
          keys: ['description'],
        },
        expected: { description: 'This is a test string' },
      },
    },
    {
      title: 'should handle array of strings within object',
      context: {
        input: {
          obj: { tags: ['  tag1  ', '  tag2  ', 'test   string   '] },
          keys: ['tags'],
        },
        expected: { tags: ['tag1', 'tag2', 'test string'] },
      },
    },
    {
      title: 'should handle array of objects within object',
      context: {
        input: {
          obj: {
            items: [{ name: '  Budi   Santoso  ' }, { name: '  Siti   Maryam  ' }],
          },
          keys: ['items'],
        },
        expected: {
          items: [{ name: 'Budi Santoso' }, { name: 'Siti Maryam' }],
        },
      },
    },
    {
      title: 'should handle nested arrays within object properties',
      context: {
        input: {
          obj: {
            tags: ['  tag1  ', '  tag2  '],
            user: {
              name: '  Budi   Santoso  ',
              contact: { email: '  budi@bades.id  ' },
            },
          },
          keys: ['tags', 'user'],
        },
        expected: {
          tags: ['tag1', 'tag2'],
          user: {
            name: 'Budi Santoso',
            contact: { email: 'budi@bades.id' },
          },
        },
      },
    },
    {
      title: 'should handle mixed content array within object',
      context: {
        input: {
          obj: {
            mixedArray: [
              '  string  ',
              123,
              null,
              { text: '  nested   text  ' },
            ],
          },
          keys: ['mixedArray'],
        },
        expected: {
          mixedArray: ['string', 123, null, { text: 'nested text' }],
        },
      },
    },
  ];

  test.each(eachTestingContextFilter(testCases))(
    '$title',
    ({
      context: {
        input: { obj, keys },
        expected,
      },
    }) => {
      const result = extractAndSanitizeObjectStringFields(obj, keys);

      expect(result).toEqual(expected);
    },
  );
});
