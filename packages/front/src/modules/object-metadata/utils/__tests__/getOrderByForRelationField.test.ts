import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getOrderByForRelationField } from '@/object-metadata/utils/getOrderByForFieldMetadataType';
import { FieldMetadataType } from '~/generated-metadata/graphql';

describe('getOrderByForRelationField', () => {
  it('should generate nested orderBy for relation with TEXT label identifier', () => {
    const field: Pick<FieldMetadataItem, 'name'> = {
      name: 'keluarga',
    };

    const relatedObjectMetadataItem: Pick<
      EnrichedObjectMetadataItem,
      'fields' | 'labelIdentifierFieldMetadataId'
    > = {
      labelIdentifierFieldMetadataId: 'name-field-id',
      fields: [
        {
          id: 'name-field-id',
          name: 'name',
          type: FieldMetadataType.TEXT,
        } as FieldMetadataItem,
      ],
    };

    const result = getOrderByForRelationField({
      field,
      relatedObjectMetadataItem,
      orderByDirection: 'AscNullsLast',
    });

    // Should produce nested structure: { keluarga: { name: 'AscNullsLast' } }
    expect(result).toEqual([{ keluarga: { name: 'AscNullsLast' } }]);
  });

  it('should generate nested orderBy for relation with FULL_NAME label identifier', () => {
    const field: Pick<FieldMetadataItem, 'name'> = {
      name: 'penduduk',
    };

    const relatedObjectMetadataItem: Pick<
      EnrichedObjectMetadataItem,
      'fields' | 'labelIdentifierFieldMetadataId'
    > = {
      labelIdentifierFieldMetadataId: 'name-field-id',
      fields: [
        {
          id: 'name-field-id',
          name: 'name',
          type: FieldMetadataType.FULL_NAME,
        } as FieldMetadataItem,
      ],
    };

    const result = getOrderByForRelationField({
      field,
      relatedObjectMetadataItem,
      orderByDirection: 'DescNullsLast',
    });

    expect(result).toEqual([
      { penduduk: { name: { firstName: 'DescNullsLast' } } },
      { penduduk: { name: { lastName: 'DescNullsLast' } } },
    ]);
  });

  it('should fallback to FK when no label identifier field is found', () => {
    const field: Pick<FieldMetadataItem, 'name'> = {
      name: 'keluarga',
    };

    const relatedObjectMetadataItem: Pick<
      EnrichedObjectMetadataItem,
      'fields' | 'labelIdentifierFieldMetadataId'
    > = {
      labelIdentifierFieldMetadataId: 'non-existent-field-id',
      fields: [],
    };

    const result = getOrderByForRelationField({
      field,
      relatedObjectMetadataItem,
      orderByDirection: 'AscNullsLast',
    });

    expect(result).toEqual([{ keluargaId: 'AscNullsLast' }]);
  });

  it('should use default "name" field when labelIdentifierFieldMetadataId is not set', () => {
    const field: Pick<FieldMetadataItem, 'name'> = {
      name: 'keluarga',
    };

    const relatedObjectMetadataItem: Pick<
      EnrichedObjectMetadataItem,
      'fields' | 'labelIdentifierFieldMetadataId'
    > = {
      labelIdentifierFieldMetadataId: undefined as unknown as string,
      fields: [
        {
          id: 'name-field-id',
          name: 'name',
          type: FieldMetadataType.TEXT,
        } as FieldMetadataItem,
      ],
    };

    const result = getOrderByForRelationField({
      field,
      relatedObjectMetadataItem,
      orderByDirection: 'AscNullsLast',
    });

    // When labelIdentifierFieldMetadataId is not set, isLabelIdentifierField
    // falls back to checking for a field named 'name'
    expect(result).toEqual([{ keluarga: { name: 'AscNullsLast' } }]);
  });

  it('should handle descending direction', () => {
    const field: Pick<FieldMetadataItem, 'name'> = {
      name: 'keluarga',
    };

    const relatedObjectMetadataItem: Pick<
      EnrichedObjectMetadataItem,
      'fields' | 'labelIdentifierFieldMetadataId'
    > = {
      labelIdentifierFieldMetadataId: 'name-field-id',
      fields: [
        {
          id: 'name-field-id',
          name: 'name',
          type: FieldMetadataType.TEXT,
        } as FieldMetadataItem,
      ],
    };

    const result = getOrderByForRelationField({
      field,
      relatedObjectMetadataItem,
      orderByDirection: 'DescNullsLast',
    });

    expect(result).toEqual([{ keluarga: { name: 'DescNullsLast' } }]);
  });
});
