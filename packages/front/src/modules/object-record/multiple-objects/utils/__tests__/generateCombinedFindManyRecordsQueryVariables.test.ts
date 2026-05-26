import { type RecordGqlFields } from '@/object-record/graphql/record-gql-fields/types/RecordGqlFields';
import { type RecordGqlOperationSignature } from 'shared/types';
import { generateCombinedFindManyRecordsQueryVariables } from '@/object-record/multiple-objects/utils/generateCombinedFindManyRecordsQueryVariables';

describe('useCombinedFindManyRecordsQueryVariables', () => {
  it('should generate variables with after cursor and first limit', () => {
    const operationSignatures: RecordGqlOperationSignature[] = [
      {
        objectNameSingular: 'penduduk',
        fields: {
          id: true,
          name: {
            firstName: true,
            lastName: true,
          },
        } satisfies RecordGqlFields,
        variables: {
          filter: { id: { eq: '123' } },
          orderBy: [{ createdAt: 'AscNullsLast' }],
          limit: 10,
          cursorFilter: {
            cursor: 'cursor123',
            cursorDirection: 'after',
          },
        },
      },
    ];

    const result = generateCombinedFindManyRecordsQueryVariables({
      operationSignatures,
    });

    expect(result).toEqual({
      filterPenduduk: { id: { eq: '123' } },
      orderByPenduduk: [{ createdAt: 'AscNullsLast' }],
      afterPenduduk: 'cursor123',
      firstPenduduk: 10,
    });
  });

  it('should generate variables with before cursor and last limit', () => {
    const operationSignatures: RecordGqlOperationSignature[] = [
      {
        objectNameSingular: 'penduduk',
        fields: {
          id: true,
          name: true,
        } as RecordGqlFields,
        variables: {
          filter: { id: { eq: '123' } },
          orderBy: [{ createdAt: 'AscNullsLast' }],
          limit: 10,
          cursorFilter: {
            cursor: 'cursor123',
            cursorDirection: 'before',
          },
        },
      },
    ];

    const result = generateCombinedFindManyRecordsQueryVariables({
      operationSignatures,
    });

    expect(result).toEqual({
      filterPenduduk: { id: { eq: '123' } },
      orderByPenduduk: [{ createdAt: 'AscNullsLast' }],
      beforePenduduk: 'cursor123',
      lastPenduduk: 10,
    });
  });

  it('should generate variables with limit only (no cursor)', () => {
    const operationSignatures: RecordGqlOperationSignature[] = [
      {
        objectNameSingular: 'penduduk',
        fields: {
          id: true,
          name: true,
        } as RecordGqlFields,
        variables: {
          filter: { id: { eq: '123' } },
          orderBy: [{ createdAt: 'AscNullsLast' }],
          limit: 10,
        },
      },
    ];

    const result = generateCombinedFindManyRecordsQueryVariables({
      operationSignatures,
    });

    expect(result).toEqual({
      filterPenduduk: { id: { eq: '123' } },
      orderByPenduduk: [{ createdAt: 'AscNullsLast' }],
      limitPenduduk: 10,
    });
  });

  it('should handle multiple objects with different pagination strategies', () => {
    const operationSignatures: RecordGqlOperationSignature[] = [
      {
        objectNameSingular: 'penduduk',
        fields: {
          id: true,
        } as RecordGqlFields,
        variables: {
          filter: { id: { eq: '123' } },
          limit: 10,
          cursorFilter: {
            cursor: 'cursor123',
            cursorDirection: 'after',
          },
        },
      },
      {
        objectNameSingular: 'keluarga',
        fields: {
          id: true,
        } as RecordGqlFields,
        variables: {
          filter: { name: { eq: 'Bades' } },
          limit: 20,
        },
      },
    ];

    const result = generateCombinedFindManyRecordsQueryVariables({
      operationSignatures,
    });

    expect(result).toEqual({
      filterPenduduk: { id: { eq: '123' } },
      afterPenduduk: 'cursor123',
      firstPenduduk: 10,
      filterKeluarga: { name: { eq: 'Bades' } },
      limitKeluarga: 20,
    });
  });

  it('should handle empty operation signatures', () => {
    const result = generateCombinedFindManyRecordsQueryVariables({
      operationSignatures: [],
    });

    expect(result).toEqual({});
  });

  it('should handle empty variables', () => {
    const operationSignatures: RecordGqlOperationSignature[] = [
      {
        objectNameSingular: 'penduduk',
        fields: {
          id: true,
        } as RecordGqlFields,
        variables: {},
      },
    ];

    const result = generateCombinedFindManyRecordsQueryVariables({
      operationSignatures,
    });

    expect(result).toEqual({});
  });

  it('should handle cursor without limit', () => {
    const operationSignatures: RecordGqlOperationSignature[] = [
      {
        objectNameSingular: 'penduduk',
        fields: {
          id: true,
        } as RecordGqlFields,
        variables: {
          cursorFilter: {
            cursor: 'cursor123',
            cursorDirection: 'after',
          },
        },
      },
    ];

    const result = generateCombinedFindManyRecordsQueryVariables({
      operationSignatures,
    });

    expect(result).toEqual({
      afterPenduduk: 'cursor123',
    });
  });
});
