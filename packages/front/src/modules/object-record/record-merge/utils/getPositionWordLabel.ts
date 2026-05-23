import { t } from '~/utils/i18n/badesI18n';
import { type MUTATION_MAX_MERGE_RECORDS } from 'shared/constants';
import { type FixedLengthArray } from '@/object-record/record-merge/types/FixedLengthArray';

export const getPositionWordLabel = (index: number): string => {
  const labels: FixedLengthArray<string, typeof MUTATION_MAX_MERGE_RECORDS> = [
    t`First`,
    t`Second`,
    t`Third`,
    t`Fourth`,
    t`Fifth`,
    t`Sixth`,
    t`Seventh`,
    t`Eighth`,
    t`Ninth`,
  ];
  return labels[index] || '';
};
