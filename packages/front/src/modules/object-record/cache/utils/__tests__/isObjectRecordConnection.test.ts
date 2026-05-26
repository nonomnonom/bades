import { isObjectRecordConnection } from '@/object-record/cache/utils/isObjectRecordConnection';

describe('isObjectRecordConnection', () => {
  it('should return true for valid connection with edges', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
      edges: [
        {
          __typename: 'PendudukEdge',
          node: {
            id: '123',
          },
        },
        {
          __typename: 'PendudukEdge',
          node: {
            id: '456',
          },
        },
      ],
    };

    const result = isObjectRecordConnection('penduduk', storeValue);

    expect(result).toBe(true);
  });

  it('should return true for valid connection with empty edges array', () => {
    const storeValue = {
      __typename: 'KeluargaConnection',
      edges: [],
    };

    const result = isObjectRecordConnection('keluarga', storeValue);

    expect(result).toBe(true);
  });

  it('should return true for valid connection without edges (optional)', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
    };

    const result = isObjectRecordConnection('penduduk', storeValue);

    expect(result).toBe(true);
  });

  it('should return false for incorrect __typename', () => {
    const storeValue = {
      __typename: 'WrongConnection',
      edges: [],
    };

    const result = isObjectRecordConnection('penduduk', storeValue);

    expect(result).toBe(false);
  });

  it('should return false for incorrect edge __typename', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
      edges: [
        {
          __typename: 'WrongEdge',
          node: {
            id: '123',
          },
        },
      ],
    };

    const result = isObjectRecordConnection('penduduk', storeValue);

    expect(result).toBe(false);
  });

  it('should return true regardless of node content', () => {
    const storeValue = {
      __typename: 'PendudukConnection',
      edges: [
        {
          __typename: 'PendudukEdge',
          node: {
            id: '123',
            name: 'Budi Saputra',
          },
        },
      ],
    };

    const result = isObjectRecordConnection('penduduk', storeValue);

    expect(result).toBe(true);
  });

  it('should return false for null value', () => {
    const result = isObjectRecordConnection('penduduk', null);

    expect(result).toBe(false);
  });

  it('should return false for undefined value', () => {
    const result = isObjectRecordConnection('penduduk', undefined);

    expect(result).toBe(false);
  });

  it('should return false for primitive value', () => {
    const result = isObjectRecordConnection('penduduk', 'not an object');

    expect(result).toBe(false);
  });

  it('should handle camelCase object names', () => {
    const storeValue = {
      __typename: 'CalendarEventConnection',
      edges: [
        {
          __typename: 'CalendarEventEdge',
          node: {
            id: '123',
          },
        },
      ],
    };

    const result = isObjectRecordConnection('calendarEvent', storeValue);

    expect(result).toBe(true);
  });
});
