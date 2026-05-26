import { type Note } from '@/activities/types/Note';

export type NoteTarget = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  note: Pick<Note, 'id' | 'createdAt' | 'updatedAt' | '__typename'>;
  [key: string]: any;
  __typename: 'NoteTarget';
};
