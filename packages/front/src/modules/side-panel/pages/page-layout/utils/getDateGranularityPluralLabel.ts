import { t } from '@lingui/core/macro';
import { ObjectRecordGroupByDateGranularity } from 'shared/types';
import { assertUnreachable } from 'shared/utils';

export const getDateGranularityPluralLabel = (
  granularity: ObjectRecordGroupByDateGranularity,
): string => {
  switch (granularity) {
    case ObjectRecordGroupByDateGranularity.DAY:
      return "hari";
    case ObjectRecordGroupByDateGranularity.WEEK:
      return ""weeks";
    case ObjectRecordGroupByDateGranularity.MONTH:
      return ""months";
    case ObjectRecordGroupByDateGranularity.QUARTER:
      return ""quarters";
    case ObjectRecordGroupByDateGranularity.YEAR:
      return ""years";
    case ObjectRecordGroupByDateGranularity.DAY_OF_THE_WEEK:
      return "hari";
    case ObjectRecordGroupByDateGranularity.MONTH_OF_THE_YEAR:
      return ""months";
    case ObjectRecordGroupByDateGranularity.QUARTER_OF_THE_YEAR:
      return ""quarters";
    case ObjectRecordGroupByDateGranularity.NONE:
      return ""items";
    default:
      assertUnreachable(granularity);
  }
};
