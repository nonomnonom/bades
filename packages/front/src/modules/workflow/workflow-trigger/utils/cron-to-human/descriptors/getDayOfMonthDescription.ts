import { t } from '@lingui/core/macro';
import { isDefined } from 'shared/utils';

import { getOrdinalNumber } from '~/utils/format/getOrdinalNumber';
import { isListValue } from '~/utils/validation/isListValue';
import { isNumericRange } from '~/utils/validation/isNumericRange';
import { isStepValue } from '~/utils/validation/isStepValue';
import { type CronDescriptionOptions } from '@/workflow/workflow-trigger/utils/cron-to-human/types/cronDescriptionOptions';

export const getDayOfMonthDescription = (
  dayOfMonth: string,
  _options: CronDescriptionOptions,
): string => {
  if (!isDefined(dayOfMonth) || dayOfMonth.trim() === '') {
    return '';
  }

  // Every day
  if (dayOfMonth === '*') {
    return t`setiap hari`;
  }

  // Last day of month
  if (dayOfMonth === 'L') {
    return t`pada hari terakhir bulan ini`;
  }

  // Weekday (W) - closest weekday to the given date
  if (dayOfMonth.includes('W')) {
    const day = dayOfMonth.replace('W', '');
    const dayNum = parseInt(day, 10);
    if (!isNaN(dayNum)) {
      const ordinalDay = getOrdinalNumber(dayNum);
      return t`pada hari kerja terdekat dengan tanggal ${ordinalDay} bulan ini`;
    }
    return t`hanya pada hari kerja`;
  }

  // Step values (e.g., "*/5" = every 5 days)
  if (isStepValue(dayOfMonth)) {
    const [range, step] = dayOfMonth.split('/');
    const stepNum = parseInt(step, 10);

    if (range === '*') {
      if (stepNum === 1) {
        return t`setiap hari`;
      }
      const stepNumStr = stepNum.toString();
      return t`setiap ${stepNumStr} hari`;
    }

    // Range with step (e.g., "1-15/3")
    if (range.includes('-')) {
      const [start, end] = range.split('-');
      const stepNumStr = stepNum.toString();
      const startOrdinal = getOrdinalNumber(parseInt(start, 10));
      const endOrdinal = getOrdinalNumber(parseInt(end, 10));
      return t`setiap ${stepNumStr} hari, antara tanggal ${startOrdinal} dan ${endOrdinal} bulan ini`;
    }

    const stepNumStr = stepNum.toString();
    return t`setiap ${stepNumStr} hari`;
  }

  // Range values (e.g., "1-15")
  if (isNumericRange(dayOfMonth) && dayOfMonth.includes('-')) {
    const [start, end] = dayOfMonth.split('-');
    const startNum = parseInt(start, 10);
    const endNum = parseInt(end, 10);
    const startOrdinal = getOrdinalNumber(startNum);
    const endOrdinal = getOrdinalNumber(endNum);
    return t`antara tanggal ${startOrdinal} dan ${endOrdinal} bulan ini`;
  }

  // List values (e.g., "1,15,30")
  if (isListValue(dayOfMonth)) {
    const values = dayOfMonth.split(',').map((v) => v.trim());
    const ordinalDays = values.map((day) => {
      const dayNum = parseInt(day, 10);
      return !isNaN(dayNum) ? getOrdinalNumber(dayNum) : day;
    });

    if (ordinalDays.length === 2) {
      const firstDay = ordinalDays[0];
      const secondDay = ordinalDays[1];
      return t`pada tanggal ${firstDay} dan ${secondDay} bulan ini`;
    }
    const lastDay = ordinalDays.pop();
    const remainingDays = ordinalDays.join(', ');
    return t`pada tanggal ${remainingDays} dan ${lastDay} bulan ini`;
  }

  // Single day value
  const dayNum = parseInt(dayOfMonth, 10);
  if (!isNaN(dayNum)) {
    const ordinalDay = getOrdinalNumber(dayNum);
    return t`pada tanggal ${ordinalDay} bulan ini`;
  }

  return dayOfMonth;
};
