import { t } from '@lingui/core/macro';
import { ObjectRecordGroupByDateGranularity } from 'shared/types';

export const getDateGranularityLabel = (
  granularity: ObjectRecordGroupByDateGranularity,
): string => {
  switch (granularity) {
    case ObjectRecordGroupByDateGranularity.DAY:
      return t`Day`;
    case ObjectRecordGroupByDateGranularity.WEEK:
      return t`Week`;
    case ObjectRecordGroupByDateGranularity.MONTH:
      return t`Month`;
    case ObjectRecordGroupByDateGranularity.QUARTER:
      return t`Quarter`;
    case ObjectRecordGroupByDateGranularity.YEAR:
      return t`Year`;
    case ObjectRecordGroupByDateGranularity.DAY_OF_THE_WEEK:
      return t`Hari dalam seminggu`;
    case ObjectRecordGroupByDateGranularity.MONTH_OF_THE_YEAR:
      return t`Bulan dalam setahun`;
    case ObjectRecordGroupByDateGranularity.QUARTER_OF_THE_YEAR:
      return t`Kuartal dalam setahun`;
    case ObjectRecordGroupByDateGranularity.NONE:
      return t`None`;
    default:
      return granularity;
  }
};
