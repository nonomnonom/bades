import { type WorkflowActionType } from '@/workflow/types/Workflow';

export const CODE_ACTION: {
  defaultLabel: string;
  type: Extract<WorkflowActionType, 'CODE'>;
  icon: string;
} = {
  defaultLabel: 'Kode - Fungsi Logika',
  type: 'CODE',
  icon: 'IconCode',
};
