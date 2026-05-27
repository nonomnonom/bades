import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { mergeManyToOneRelationship } from '@/object-record/record-merge/utils/mergeManyToOneRelationship';
import { mergeOneToManyRelationships } from '@/object-record/record-merge/utils/mergeOneToManyRelationships';
import { mergeRecordRelationshipData } from '@/object-record/record-merge/utils/mergeRelationshipData';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { FieldMetadataType, RelationType } from '~/generated-metadata/graphql';

describe('mergeOneToManyRelationships', () => {
  it('should merge one-to-many relationships and remove duplicates', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Keluarga',
        id: 'record1',
        daftarProgramBantuan: [
          { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
          { __typename: 'ProgramBantuan', id: 'pb2', name: 'Program 2' },
        ],
      },
      {
        __typename: 'Keluarga',
        id: 'record2',
        daftarProgramBantuan: [
          { __typename: 'ProgramBantuan', id: 'pb2', name: 'Program 2' }, // Duplikat
          { __typename: 'ProgramBantuan', id: 'pb3', name: 'Program 3' },
        ],
      },
    ];

    const result = mergeOneToManyRelationships(records, 'daftarProgramBantuan');

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
      { __typename: 'ProgramBantuan', id: 'pb2', name: 'Program 2' },
      { __typename: 'ProgramBantuan', id: 'pb3', name: 'Program 3' },
    ]);
  });

  it('should handle empty arrays', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Keluarga',
        id: 'record1',
        daftarProgramBantuan: [],
      },
      {
        __typename: 'Keluarga',
        id: 'record2',
        daftarProgramBantuan: [],
      },
    ];

    const result = mergeOneToManyRelationships(records, 'daftarProgramBantuan');

    expect(result).toEqual([]);
  });

  it('should handle records with null or undefined relationship values', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Keluarga',
        id: 'record1',
        daftarProgramBantuan: [
          { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
        ],
      },
      {
        __typename: 'Keluarga',
        id: 'record2',
        daftarProgramBantuan: null,
      },
      {
        __typename: 'Keluarga',
        id: 'record3',
        daftarProgramBantuan: undefined,
      },
    ];

    const result = mergeOneToManyRelationships(records, 'daftarProgramBantuan');

    expect(result).toEqual([
      { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
    ]);
  });

  it('should handle empty records array', () => {
    const result = mergeOneToManyRelationships([], 'daftarProgramBantuan');

    expect(result).toEqual([]);
  });
});

describe('mergeManyToOneRelationship', () => {
  it('should return the first non-null value', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Penduduk',
        id: 'record1',
        keluarga: null,
      },
      {
        __typename: 'Penduduk',
        id: 'record2',
        keluarga: {
          __typename: 'Keluarga',
          id: 'keluarga1',
          name: 'Keluarga Santoso',
        },
      },
      {
        __typename: 'Penduduk',
        id: 'record3',
        keluarga: {
          __typename: 'Keluarga',
          id: 'keluarga2',
          name: 'Keluarga Budiman',
        },
      },
    ];

    const result = mergeManyToOneRelationship(records, 'keluarga');

    expect(result).toEqual({
      __typename: 'Keluarga',
      id: 'keluarga1',
      name: 'Keluarga Santoso',
    });
  });

  it('should return the first non-undefined value', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Penduduk',
        id: 'record1',
        keluarga: undefined,
      },
      {
        __typename: 'Penduduk',
        id: 'record2',
        keluarga: {
          __typename: 'Keluarga',
          id: 'keluarga1',
          name: 'Keluarga Santoso',
        },
      },
    ];

    const result = mergeManyToOneRelationship(records, 'keluarga');

    expect(result).toEqual({
      __typename: 'Keluarga',
      id: 'keluarga1',
      name: 'Keluarga Santoso',
    });
  });

  it('should return null if all values are null or undefined', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Penduduk',
        id: 'record1',
        keluarga: null,
      },
      {
        __typename: 'Penduduk',
        id: 'record2',
        keluarga: undefined,
      },
    ];

    const result = mergeManyToOneRelationship(records, 'keluarga');

    expect(result).toBeNull();
  });

  it('should handle empty records array', () => {
    const result = mergeManyToOneRelationship([], 'keluarga');

    expect(result).toBeNull();
  });
});

describe('mergeRecordRelationshipData', () => {
  const mockFieldMetadataItems: FieldMetadataItem[] = [
    {
      id: 'field1',
      name: 'daftarProgramBantuan',
      type: FieldMetadataType.RELATION,
      relation: {
        type: RelationType.ONE_TO_MANY,
      },
    } as FieldMetadataItem,
    {
      id: 'field2',
      name: 'keluarga',
      type: FieldMetadataType.RELATION,
      relation: {
        type: RelationType.MANY_TO_ONE,
      },
    } as FieldMetadataItem,
    {
      id: 'field3',
      name: 'name',
      type: FieldMetadataType.TEXT,
    } as FieldMetadataItem,
  ];

  it('should merge all relationship fields correctly', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Keluarga',
        id: 'record1',
        daftarProgramBantuan: [
          { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
          { __typename: 'ProgramBantuan', id: 'pb2', name: 'Program 2' },
        ],
        keluarga: null,
        name: 'Record 1',
      },
      {
        __typename: 'Keluarga',
        id: 'record2',
        daftarProgramBantuan: [
          { __typename: 'ProgramBantuan', id: 'pb2', name: 'Program 2' },
          { __typename: 'ProgramBantuan', id: 'pb3', name: 'Program 3' },
        ],
        keluarga: {
          __typename: 'Keluarga',
          id: 'keluarga1',
          name: 'Keluarga Santoso',
        },
        name: 'Record 2',
      },
    ];

    const result = mergeRecordRelationshipData(
      records,
      mockFieldMetadataItems,
      false,
    );

    expect(result).toEqual({
      daftarProgramBantuan: [
        { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
        { __typename: 'ProgramBantuan', id: 'pb2', name: 'Program 2' },
        { __typename: 'ProgramBantuan', id: 'pb3', name: 'Program 3' },
      ],
      keluarga: {
        __typename: 'Keluarga',
        id: 'keluarga1',
        name: 'Keluarga Santoso',
      },
    });
  });

  it('should return empty object when isLoading is true', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Keluarga',
        id: 'record1',
        daftarProgramBantuan: [
          { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
        ],
        keluarga: {
          __typename: 'Keluarga',
          id: 'keluarga1',
          name: 'Keluarga Santoso',
        },
      },
    ];

    const result = mergeRecordRelationshipData(
      records,
      mockFieldMetadataItems,
      true,
    );

    expect(result).toEqual({});
  });

  it('should return empty object when records array is empty', () => {
    const result = mergeRecordRelationshipData(
      [],
      mockFieldMetadataItems,
      false,
    );

    expect(result).toEqual({});
  });

  it('should only process relation fields', () => {
    const records: ObjectRecord[] = [
      {
        __typename: 'Keluarga',
        id: 'record1',
        daftarProgramBantuan: [
          { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
        ],
        keluarga: {
          __typename: 'Keluarga',
          id: 'keluarga1',
          name: 'Keluarga Santoso',
        },
        name: 'Record 1',
        email: 'test@example.com',
      },
    ];

    const result = mergeRecordRelationshipData(
      records,
      mockFieldMetadataItems,
      false,
    );

    expect(result).toEqual({
      daftarProgramBantuan: [
        { __typename: 'ProgramBantuan', id: 'pb1', name: 'Program 1' },
      ],
      keluarga: {
        __typename: 'Keluarga',
        id: 'keluarga1',
        name: 'Keluarga Santoso',
      },
    });
    expect(result).not.toHaveProperty('name');
    expect(result).not.toHaveProperty('email');
  });

  it('should handle fields without relation metadata', () => {
    const fieldsWithoutRelation: FieldMetadataItem[] = [
      {
        id: 'field1',
        name: 'name',
        type: FieldMetadataType.TEXT,
      } as FieldMetadataItem,
    ];

    const records: ObjectRecord[] = [
      {
        __typename: 'Keluarga',
        id: 'record1',
        name: 'Record 1',
      },
    ];

    const result = mergeRecordRelationshipData(
      records,
      fieldsWithoutRelation,
      false,
    );

    expect(result).toEqual({});
  });
});
