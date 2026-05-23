import { type MUTATION_MAX_MERGE_RECORDS } from 'shared/constants';
import { type FixedLengthArray } from '@/object-record/record-merge/types/FixedLengthArray';

export const getPositionWordLabel = (index: number): string => {
  const labels: FixedLengthArray<string, typeof MUTATION_MAX_MERGE_RECORDS> = [
    'Pertama',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
    'Ninth',
  ];
  return labels[index] || '';
};
