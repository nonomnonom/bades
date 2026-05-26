import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { RelationType } from 'shared/types';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { getFieldMetadataFromGqlField } from '@/object-record/cache/utils/getFieldMetadataFromGqlField';

const objectMetadataItemGenerator = (relationType: RelationType) => {
  return {
    nameSingular: 'programBantuan',
    namePlural: 'daftarProgramBantuan',
    fields: [
      {
        name: 'pemilik',
        type: FieldMetadataType.MORPH_RELATION,
        morphRelations: [
          {
            type: relationType,
            targetObjectMetadata: {
              nameSingular: 'keluarga',
              namePlural: 'daftarKeluarga',
            },
            targetFieldMetadata: {
              name: 'dimilikiOleh',
              type: FieldMetadataType.RELATION,
            },
            sourceFieldMetadata: {
              name: 'pemilik',
              type: FieldMetadataType.MORPH_RELATION,
            },
            sourceObjectMetadata: {
              nameSingular: 'programBantuan',
              namePlural: 'daftarProgramBantuan',
            },
          },
          {
            type: relationType,
            targetObjectMetadata: {
              nameSingular: 'penduduk',
              namePlural: 'daftarPenduduk',
            },
            targetFieldMetadata: {
              name: 'dimilikiOleh',
              type: FieldMetadataType.RELATION,
            },
            sourceFieldMetadata: {
              name: 'pemilik',
              type: FieldMetadataType.MORPH_RELATION,
            },
            sourceObjectMetadata: {
              nameSingular: 'programBantuan',
              namePlural: 'daftarProgramBantuan',
            },
          },
        ],
      } as unknown as FieldMetadataItem,
    ],
  };
};

describe('getFieldMetadataFromGqlField', () => {
  it('should find "name"', () => {
    const objectMetadataItem = {
      fields: [
        {
          name: 'name',
          type: FieldMetadataType.FULL_NAME,
        } as unknown as FieldMetadataItem,
      ],
    };

    const result = getFieldMetadataFromGqlField({
      objectMetadataItem,
      gqlField: 'name',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('name');
    expect(result?.type).toBe(FieldMetadataType.FULL_NAME);
  });

  it('should find keluarga by join column name of a relation field', () => {
    const objectMetadataItem = {
      fields: [
        {
          name: 'keluarga',
          type: FieldMetadataType.RELATION,
          settings: {
            joinColumnName: 'keluargaId',
          },
        } as FieldMetadataItem,
      ],
    };

    const result = getFieldMetadataFromGqlField({
      objectMetadataItem,
      gqlField: 'keluargaId',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('keluarga');
    expect(result?.type).toBe(FieldMetadataType.RELATION);
    expect(result?.settings?.joinColumnName).toBe('keluargaId');
  });

  it('should return undefined for non-existent field', () => {
    const objectMetadataItem = {
      fields: [
        {
          name: 'name',
          type: FieldMetadataType.TEXT,
        } as unknown as FieldMetadataItem,
      ],
    };

    const result = getFieldMetadataFromGqlField({
      objectMetadataItem,
      gqlField: 'nonExistentField',
    });

    expect(result).toBeUndefined();
  });

  it('should find pemilik by direct morph relation ONE_TO_MANY field name', () => {
    const objectMetadataItem = objectMetadataItemGenerator(
      RelationType.ONE_TO_MANY,
    );
    const result = getFieldMetadataFromGqlField({
      objectMetadataItem,
      gqlField: 'pemilik',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('pemilik');
    expect(result?.type).toBe(FieldMetadataType.MORPH_RELATION);
  });

  it('should find pemilikDaftarKeluarga by computed morph relation ONE_TO_MANY field name', () => {
    const objectMetadataItem = objectMetadataItemGenerator(
      RelationType.ONE_TO_MANY,
    );
    const result = getFieldMetadataFromGqlField({
      objectMetadataItem,
      gqlField: 'pemilikDaftarKeluarga',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('pemilik');
    expect(result?.type).toBe(FieldMetadataType.MORPH_RELATION);
  });

  it('should find pemilikPenduduk by computed morph relation MANY_TO_ONE field name', () => {
    const objectMetadataItem = objectMetadataItemGenerator(
      RelationType.MANY_TO_ONE,
    );
    const result = getFieldMetadataFromGqlField({
      objectMetadataItem,
      gqlField: 'pemilikPenduduk',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('pemilik');
    expect(result?.type).toBe(FieldMetadataType.MORPH_RELATION);
  });

  it('should find pemilikPendudukId by computed morph relation join column name MANY_TO_ONE field name', () => {
    const objectMetadataItem = objectMetadataItemGenerator(
      RelationType.MANY_TO_ONE,
    );
    const result = getFieldMetadataFromGqlField({
      objectMetadataItem,
      gqlField: 'pemilikPendudukId',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('pemilik');
    expect(result?.type).toBe(FieldMetadataType.MORPH_RELATION);
  });
});
