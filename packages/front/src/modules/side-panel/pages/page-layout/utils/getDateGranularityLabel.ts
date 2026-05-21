import { t } from '@lingui/core/macro';
import { ObjectRecordGroupByDateGranularity } from 'shared/types';

export const getDateGranularityLabel = (
  granularity: ObjectRecordGroupByDateGranularity,
): string => {
  switch (granularity) {
    case ObjectRecordGroupByDateGranularity.DAY:
      return "Hari";
    case ObjectRecordGroupByDateGranularity.WEEK:
      return "Minggu";
    case ObjectRecordGroupByDateGranularity.MONTH:
      return "Bulan";
    case ObjectRecordGroupByDateGranularity.QUARTER:
      return "Kuartal";
    case ObjectRecordGroupByDateGranularity.YEAR:
      return ""Year";
    case ObjectRecordGroupByDateGranularity.DAY_OF_THE_WEEK:
      return ""Day of the week";
    case ObjectRecordGroupByDateGranularity.MONTH_OF_THE_YEAR:
      return ""Month of the year";
    case ObjectRecordGroupByDateGranularity.QUARTER_OF_THE_YEAR:
      return ""Quarter of the year";
    case ObjectRecordGroupByDateGranularity.NONE:
      return "Tidak ada";
    default:
      return granularity;
  }
};
