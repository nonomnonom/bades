import { type ObjectRecord } from 'shared/types';

export type PartialObjectRecordWithId = Partial<ObjectRecord> & { id: string };
