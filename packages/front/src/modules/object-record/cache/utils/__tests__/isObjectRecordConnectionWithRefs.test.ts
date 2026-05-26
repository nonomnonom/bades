import { isObjectRecordConnectionWithRefs } from '@/object-record/cache/utils/isObjectRecordConnectionWithRefs';

describe('isObjectRecordConnectionWithRefs', () => {
  it('should return true for valid connection with edges', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
      edges: [
        {
          __typename: 'PendudukEdge',
          node: {
            __ref: 'Penduduk:123',
          },
        },
        {
          __typename: 'PendudukEdge',
          node: {
            __ref: 'Penduduk:456',
          },
        },
      ],
    };

    const result = isObjectRecordConnectionWithRefs('penduduk', storeValue);

    expect(result).toBe(true);
  });

  it('should return true for valid connection with empty edges array', () => {
    const storeValue = {
      __typename: 'KeluargaConnection',
      edges: [],
    };

    const result = isObjectRecordConnectionWithRefs('keluarga', storeValue);

    expect(result).toBe(true);
  });

  it('should return false for connection without edges (required)', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
    };

    const result = isObjectRecordConnectionWithRefs('penduduk', storeValue);

    expect(result).toBe(false);
  });

  it('should return false for incorrect __typename', () => {
    const storeValue = {
      __typename: 'WrongConnection',
      edges: [],
    };

    const result = isObjectRecordConnectionWithRefs('penduduk', storeValue);

    expect(result).toBe(false);
  });

  it('should return false for incorrect edge __typename', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
      edges: [
        {
          __typename: 'WrongEdge',
          node: {
            __ref: 'Penduduk:123',
          },
        },
      ],
    };

    const result = isObjectRecordConnectionWithRefs('penduduk', storeValue);

    expect(result).toBe(false);
  });

  it('should return false for incorrect __ref prefix', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
      edges: [
        {
          __typename: 'PendudukEdge',
          node: {
            __ref: 'Keluarga:123',
          },
        },
      ],
    };

    const result = isObjectRecordConnectionWithRefs('penduduk', storeValue);

    expect(result).toBe(false);
  });

  it('should return false for null value', () => {
    const result = isObjectRecordConnectionWithRefs('penduduk', null);

    expect(result).toBe(false);
  });

  it('should return false for undefined value', () => {
    const result = isObjectRecordConnectionWithRefs('penduduk', undefined);

    expect(result).toBe(false);
  });

  it('should return false for primitive value', () => {
    const result = isObjectRecordConnectionWithRefs(
      'penduduk',
      'not an object',
    );

    expect(result).toBe(false);
  });

  it('should handle camelCase object names', () => {
    const storeValue = {
      __typename: 'CalendarEventConnection',
      edges: [
        {
          __typename: 'CalendarEventEdge',
          node: {
            __ref: 'CalendarEvent:123',
          },
        },
      ],
    };

    const result = isObjectRecordConnectionWithRefs(
      'calendarEvent',
      storeValue,
    );

    expect(result).toBe(true);
  });

  it('should return false when node is missing __ref', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
      edges: [
        {
          __typename: 'PendudukEdge',
          node: {
            id: '123',
          },
        },
      ],
    };

    const result = isObjectRecordConnectionWithRefs('penduduk', storeValue);

    expect(result).toBe(false);
  });
});
