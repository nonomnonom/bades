import { ObjectRecordGroupByDateGranularity } from 'shared/types';

export const getDateGranularityLabel = (
  granularity: ObjectRecordGroupByDateGranularity,
): string => {
  switch (granularity) {
    case ObjectRecordGroupByDateGranularity.DAY:
      return `Hari`;
    case ObjectRecordGroupByDateGranularity.WEEK:
      return `Minggu`;
    case ObjectRecordGroupByDateGranularity.MONTH:
      return `Bulan`;
    case ObjectRecordGroupByDateGranularity.QUARTER:
      return `Kuartal`;
    case ObjectRecordGroupByDateGranularity.YEAR:
      return `Tahun`;
    case ObjectRecordGroupByDateGranularity.DAY_OF_THE_WEEK:
      return `Hari dalam seminggu`;
    case ObjectRecordGroupByDateGranularity.MONTH_OF_THE_YEAR:
      return `Bulan dalam setahun`;
    case ObjectRecordGroupByDateGranularity.QUARTER_OF_THE_YEAR:
      return `Kuartal dalam setahun`;
    case ObjectRecordGroupByDateGranularity.NONE:
      return `Tidak ada`;
    default:
      return granularity;
  }
};
