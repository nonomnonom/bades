import { type BooleanFilter } from '@/types';

export const isMatchingBooleanFilter = ({
  booleanFilter,
  value,
}: {
  booleanFilter: BooleanFilter;
  value: boolean;
}) => {
  if (booleanFilter.eq !== undefined) {
    return value === booleanFilter.eq;
  } else if (booleanFilter.is !== undefined) {
    if (booleanFilter.is === 'NULL') {
      return value === null;
    } else {
      return value !== null;
    }
  } else {
    throw new Error(
      `Nilai tidak valid untuk filter boolean: ${JSON.stringify(booleanFilter)}`,
    );
  }
};
