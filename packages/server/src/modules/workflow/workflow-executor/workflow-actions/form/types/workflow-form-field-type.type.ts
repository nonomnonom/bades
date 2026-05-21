import { type FieldMetadataType } from 'shared/types';

export type WorkflowFormFieldType =
  | FieldMetadataType.TEXT
  | FieldMetadataType.NUMBER
  | FieldMetadataType.DATE
  | 'RECORD';
