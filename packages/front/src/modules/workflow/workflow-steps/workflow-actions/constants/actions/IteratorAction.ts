import { type WorkflowActionType } from '@/workflow/types/Workflow';

export const ITERATOR_ACTION: {
  defaultLabel: string;
  type: Extract<WorkflowActionType, 'ITERATOR'>;
  icon: string;
} = {
  defaultLabel: 'Pengulang',
  type: 'ITERATOR',
  icon: 'IconRepeat',
};
