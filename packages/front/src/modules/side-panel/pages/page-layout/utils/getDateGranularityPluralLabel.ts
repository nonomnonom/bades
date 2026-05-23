import { ObjectRecordGroupByDateGranularity } from 'shared/types';
import { assertUnreachable } from 'shared/utils';

export const getDateGranularityPluralLabel = (
  granularity: ObjectRecordGroupByDateGranularity,
): string => {
  switch (granularity) {
    case ObjectRecordGroupByDateGranularity.DAY:
      return 'hari';
    case ObjectRecordGroupByDateGranularity.WEEK:
      return 'minggu';
    case ObjectRecordGroupByDateGranularity.MONTH:
      return 'bulan';
    case ObjectRecordGroupByDateGranularity.QUARTER:
      return 'kuartal';
    case ObjectRecordGroupByDateGranularity.YEAR:
      return 'tahun';
    case ObjectRecordGroupByDateGranularity.DAY_OF_THE_WEEK:
      return 'hari';
    case ObjectRecordGroupByDateGranularity.MONTH_OF_THE_YEAR:
      return 'bulan';
    case ObjectRecordGroupByDateGranularity.QUARTER_OF_THE_YEAR:
      return 'kuartal';
    case ObjectRecordGroupByDateGranularity.NONE:
      return 'item';
    default:
      assertUnreachable(granularity);
  }
};
