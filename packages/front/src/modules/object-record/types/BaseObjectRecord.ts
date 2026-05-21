import { type ObjectRecord as SharedObjectRecord } from 'shared/types';

export type BaseObjectRecord = SharedObjectRecord & {
  __typename: string;
};
