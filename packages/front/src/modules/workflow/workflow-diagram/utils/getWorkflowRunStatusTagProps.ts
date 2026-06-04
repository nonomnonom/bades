import { type WorkflowRunStatus } from '@/workflow/types/Workflow';
import { type TagColor } from 'ui/components';

export const getWorkflowRunStatusTagProps = ({
  workflowRunStatus,
}: {
  workflowRunStatus: WorkflowRunStatus;
}): { color: TagColor; text: string } => {
  if (workflowRunStatus === 'NOT_STARTED') {
    return {
      color: 'gray',
      text: 'Belum dimulai',
    };
  }

  if (workflowRunStatus === 'RUNNING') {
    return {
      color: 'yellow',
      text: 'Berjalan',
    };
  }

  if (workflowRunStatus === 'COMPLETED') {
    return {
      color: 'green',
      text: 'Selesai',
    };
  }

  if (workflowRunStatus === 'ENQUEUED') {
    return {
      color: 'blue',
      text: 'Terantri',
    };
  }

  if (workflowRunStatus === 'STOPPING') {
    return {
      color: 'orange',
      text: 'Menghentikan',
    };
  }

  if (workflowRunStatus === 'STOPPED') {
    return {
      color: 'gray',
      text: 'Berhenti',
    };
  }

  return {
    color: 'red',
    text: 'Gagal',
  };
};
