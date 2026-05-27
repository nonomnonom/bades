import { FieldMetadataType } from 'shared/types';
import { type WorkflowFormFieldType } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormFieldType';
import { assertUnreachable } from 'shared/utils';
import { v4 } from 'uuid';

export const getDefaultFormFieldSettings = (type: WorkflowFormFieldType) => {
  switch (type) {
    case FieldMetadataType.TEXT:
      return {
        id: v4(),
        name: 'text',
        label: 'Teks',
        placeholder: 'Masukkan teks',
      };
    case FieldMetadataType.NUMBER:
      return {
        id: v4(),
        name: 'number',
        label: 'Nomor',
        placeholder: '1000',
      };
    case FieldMetadataType.DATE:
      return {
        id: v4(),
        name: 'date',
        label: 'Tanggal',
        placeholder: 'dd/mm/yyyy',
      };
    case 'RECORD':
      return {
        id: v4(),
        name: 'record',
        label: 'Rekaman',
        placeholder: 'Pilih Keluarga',
        settings: {
          objectName: 'keluarga',
        },
      };
    case FieldMetadataType.SELECT:
      return {
        id: v4(),
        name: 'select',
        label: 'Pilih',
        placeholder: 'Pilih nilai',
        settings: {
          selectType: 'EXISTING_FIELD',
          selectedFieldId: undefined,
        },
      };
    case FieldMetadataType.MULTI_SELECT:
      return {
        id: v4(),
        name: 'multiSelect',
        label: 'Multi-Pilih',
        placeholder: 'Pilih beberapa nilai',
        settings: {
          selectType: 'EXISTING_FIELD',
          selectedFieldId: undefined,
        },
      };
    default:
      assertUnreachable(type);
  }
};
