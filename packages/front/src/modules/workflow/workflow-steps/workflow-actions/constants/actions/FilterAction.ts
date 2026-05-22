import { type WorkflowActionType } from '@/workflow/types/Workflow';

export const FILTER_ACTION: {
  defaultLabel: string;
  type: Extract<WorkflowActionType, 'FILTER'>;
  icon: string;
} = {
  defaultLabel: 'Filter Data',
  type: 'FILTER',
  icon: 'IconFilter',
};
