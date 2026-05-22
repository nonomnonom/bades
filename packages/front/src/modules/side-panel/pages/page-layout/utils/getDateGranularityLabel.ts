import { t } from '~/utils/i18n/badesI18n';
import { ObjectRecordGroupByDateGranularity } from 'shared/types';

export const getDateGranularityLabel = (
  granularity: ObjectRecordGroupByDateGranularity,
): string => {
  switch (granularity) {
    case ObjectRecordGroupByDateGranularity.DAY:
      return t`Hari`;
    case ObjectRecordGroupByDateGranularity.WEEK:
      return t`Minggu`;
    case ObjectRecordGroupByDateGranularity.MONTH:
      return t`Bulan`;
    case ObjectRecordGroupByDateGranularity.QUARTER:
      return t`Kuartal`;
    case ObjectRecordGroupByDateGranularity.YEAR:
      return t`Tahun`;
    case ObjectRecordGroupByDateGranularity.DAY_OF_THE_WEEK:
      return t`Hari dalam seminggu`;
    case ObjectRecordGroupByDateGranularity.MONTH_OF_THE_YEAR:
      return t`Bulan dalam setahun`;
    case ObjectRecordGroupByDateGranularity.QUARTER_OF_THE_YEAR:
      return t`Kuartal dalam setahun`;
    case ObjectRecordGroupByDateGranularity.NONE:
      return t`Tidak ada`;
    default:
      return granularity;
  }
};
