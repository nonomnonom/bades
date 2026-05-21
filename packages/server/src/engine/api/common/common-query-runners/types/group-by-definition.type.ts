import { type ObjectRecordGroupByDateGranularity } from 'shared/types';

export type GroupByDefinition = {
  columnNameWithQuotes: string;
  expression: string;
  alias: string;
  dateGranularity?: ObjectRecordGroupByDateGranularity;
};
