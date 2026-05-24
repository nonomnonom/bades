import { type Task } from '@/activities/types/Task';
import { type WorkspaceMember } from '~/generated-metadata/graphql';

export type TaskTarget = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  taskId: string | null;
  task: Pick<Task, 'id' | 'createdAt' | 'updatedAt' | '__typename'>;
  assignee?: Partial<WorkspaceMember>;
  [key: string]: any;
  __typename: 'TaskTarget';
};
