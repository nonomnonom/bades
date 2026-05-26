import { type StepOutputSchemaV2 } from '@/workflow/workflow-variables/types/StepOutputSchemaV2';
import { getCurrentSubStepFromPath } from '@/workflow/workflow-variables/utils/getCurrentSubStepFromPath';
import { FieldMetadataType } from 'shared/types';

const mockStep = {
  id: 'step-1',
  name: 'Step 1',
  type: 'CREATE_RECORD',
  outputSchema: {
    company: {
      isLeaf: false,
      label: 'Keluarga',
      value: {
        object: {
          label: 'Keluarga',
          objectMetadataId: '123',
          isRelationField: false,
        },
        fields: {
          name: {
            label: 'Name',
            value: 'Bades',
            isLeaf: true,
            fieldMetadataId: '123e4567-e89b-12d3-a456-426614174000',
            type: FieldMetadataType.TEXT,
            isCompositeSubField: false,
          },
        },
        _outputSchemaType: 'RECORD',
      },
    },
  },
} satisfies StepOutputSchemaV2;

describe('getCurrentSubStepFromPath', () => {
  it('should return the current sub step from the path', () => {
    const path = ['keluarga', 'name'];
    expect(getCurrentSubStepFromPath(mockStep, path)).toBe('Bades');
  });

  it('should return undefined when the path is not valid', () => {
    const path = ['keluarga', 'unknown'];
    expect(getCurrentSubStepFromPath(mockStep, path)).toBe(undefined);
  });
});
