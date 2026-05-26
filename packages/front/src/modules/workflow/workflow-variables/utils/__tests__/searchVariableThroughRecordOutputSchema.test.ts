import { type RecordOutputSchemaV2 } from '@/workflow/workflow-variables/types/RecordOutputSchemaV2';
import { searchVariableThroughRecordOutputSchema } from '@/workflow/workflow-variables/utils/searchVariableThroughRecordOutputSchema';
import { FieldMetadataType } from '~/generated-metadata/graphql';

describe('searchVariableThroughRecordOutputSchema', () => {
  const mockRecordSchema: RecordOutputSchemaV2 = {
    object: {
      objectMetadataId: 'keluarga-metadata-id',
      label: 'Keluarga',
    },
    fields: {
      name: {
        isLeaf: true,
        type: FieldMetadataType.TEXT,
        label: 'Keluarga Name',
        value: 'Keluarga Santoso',
        fieldMetadataId: 'keluarga-name-metadata-id',
        isCompositeSubField: false,
      },
      address: {
        isLeaf: false,
        label: 'Address',
        fieldMetadataId: 'address-metadata-id',
        type: FieldMetadataType.ADDRESS,
        value: {
          street: {
            isLeaf: true,
            type: FieldMetadataType.TEXT,
            label: 'Street',
            value: '123 Main St',
            fieldMetadataId: 'street-metadata-id',
            isCompositeSubField: true,
          },
        },
      },
      // Record field (nested record)
      owner: {
        isLeaf: false,
        label: 'Owner',
        fieldMetadataId: 'owner-metadata-id',
        type: FieldMetadataType.RELATION,
        value: {
          object: {
            objectMetadataId: 'penduduk-metadata-id',
            label: 'Owner Penduduk',
            isRelationField: true,
          },
          fields: {
            firstName: {
              isLeaf: true,
              type: FieldMetadataType.TEXT,
              label: 'Owner First Name',
              value: 'Jane',
              fieldMetadataId: 'owner-firstName-metadata-id',
              isCompositeSubField: false,
            },
          },
          _outputSchemaType: 'RECORD',
        },
      },
    },
    _outputSchemaType: 'RECORD',
  };

  describe('basic field access', () => {
    it('should find a basic field (leaf)', () => {
      const result = searchVariableThroughRecordOutputSchema({
        stepName: 'Create Keluarga',
        recordOutputSchema: mockRecordSchema,
        rawVariableName: '{{step1.name}}',
        isFullRecord: false,
      });

      expect(result).toEqual({
        variableLabel: 'Keluarga Name',
        variablePathLabel: 'Create Keluarga > Keluarga Name',
        variableType: FieldMetadataType.TEXT,
        fieldMetadataId: 'keluarga-name-metadata-id',
        compositeFieldSubFieldName: undefined,
      });
    });
  });

  describe('node field access', () => {
    it('should find a node field (composite field)', () => {
      const result = searchVariableThroughRecordOutputSchema({
        stepName: 'Create Keluarga',
        recordOutputSchema: mockRecordSchema,
        rawVariableName: '{{step1.address.street}}',
        isFullRecord: false,
      });

      expect(result).toEqual({
        variableLabel: 'Street',
        variablePathLabel: 'Create Keluarga > Address > Street',
        variableType: FieldMetadataType.TEXT,
        fieldMetadataId: 'street-metadata-id',
        compositeFieldSubFieldName: 'street',
      });
    });
  });

  describe('record field access', () => {
    it('should find a record field (nested record)', () => {
      const result = searchVariableThroughRecordOutputSchema({
        stepName: 'Create Keluarga',
        recordOutputSchema: mockRecordSchema,
        rawVariableName: '{{step1.owner.firstName}}',
        isFullRecord: false,
      });

      expect(result).toEqual({
        variableLabel: 'Owner First Name',
        variablePathLabel: 'Create Keluarga > Owner > Owner First Name',
        variableType: FieldMetadataType.TEXT,
        fieldMetadataId: 'owner-firstName-metadata-id',
        compositeFieldSubFieldName: undefined,
      });
    });
  });

  describe('full record mode', () => {
    it('should return record object label when isFullRecord is true', () => {
      const result = searchVariableThroughRecordOutputSchema({
        stepName: 'Create Keluarga',
        recordOutputSchema: mockRecordSchema,
        rawVariableName: '{{step1.id}}',
        isFullRecord: true,
      });

      expect(result).toEqual({
        variableLabel: 'Keluarga',
        variablePathLabel: 'Create Keluarga > Keluarga',
        variableType: undefined,
        fieldMetadataId: undefined,
        compositeFieldSubFieldName: undefined,
      });
    });

    it('should return nested record object label when isFullRecord is true', () => {
      const result = searchVariableThroughRecordOutputSchema({
        stepName: 'Create Keluarga',
        recordOutputSchema: mockRecordSchema,
        rawVariableName: '{{step1.owner.id}}',
        isFullRecord: true,
      });

      expect(result).toEqual({
        variableLabel: 'Owner Penduduk',
        variablePathLabel: 'Create Keluarga > Owner > Owner Penduduk',
        variableType: undefined,
        fieldMetadataId: undefined,
        compositeFieldSubFieldName: undefined,
      });
    });
  });

  describe('error handling', () => {
    it('should handle undefined recordOutputSchema', () => {
      const result = searchVariableThroughRecordOutputSchema({
        stepName: 'Test Step',
        recordOutputSchema: undefined as any,
        rawVariableName: '{{step1.field}}',
        isFullRecord: false,
      });

      expect(result).toEqual({
        variableLabel: undefined,
        variablePathLabel: undefined,
      });
    });

    it('should handle non-existent field', () => {
      const result = searchVariableThroughRecordOutputSchema({
        stepName: 'Create Keluarga',
        recordOutputSchema: mockRecordSchema,
        rawVariableName: '{{step1.nonExistentField}}',
        isFullRecord: false,
      });

      expect(result).toEqual({
        variableLabel: undefined,
        variablePathLabel: undefined,
        variableType: undefined,
      });
    });

    it('should handle broken nested path', () => {
      const result = searchVariableThroughRecordOutputSchema({
        stepName: 'Create Keluarga',
        recordOutputSchema: mockRecordSchema,
        rawVariableName: '{{step1.address.nonExistent}}',
        isFullRecord: false,
      });

      expect(result).toEqual({
        variableLabel: undefined,
        variablePathLabel: undefined,
        variableType: undefined,
      });
    });
  });
});
