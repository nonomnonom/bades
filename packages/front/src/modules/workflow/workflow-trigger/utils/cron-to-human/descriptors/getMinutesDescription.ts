import { t } from '@lingui/core/macro';
import { isDefined } from 'shared/utils';

import { isListValue } from '~/utils/validation/isListValue';
import { isNumericRange } from '~/utils/validation/isNumericRange';
import { isStepValue } from '~/utils/validation/isStepValue';
import { type CronDescriptionOptions } from '@/workflow/workflow-trigger/utils/cron-to-human/types/cronDescriptionOptions';

export const getMinutesDescription = (
  minutes: string,
  _options: CronDescriptionOptions,
): string => {
  if (!isDefined(minutes) || minutes.trim() === '') {
    return '';
  }

  if (minutes === '*') {
    return t`setiap menit`;
  }

  if (isStepValue(minutes)) {
    const [range, step] = minutes.split('/');
    const stepNum = parseInt(step, 10);
    const stepNumStr = stepNum.toString();

    if (range === '*') {
      if (stepNum === 1) {
        return t`setiap menit`;
      }
      return t`setiap ${stepNumStr} menit`;
    }

    if (range.includes('-')) {
      const [start, end] = range.split('-');
      return t`setiap ${stepNumStr} menit, antara menit ke-${start} dan ${end}`;
    }

    return t`setiap ${stepNumStr} menit`;
  }

  if (isNumericRange(minutes) && minutes.includes('-')) {
    const [start, end] = minutes.split('-');
    return t`antara menit ke-${start} dan ${end}`;
  }

  if (isListValue(minutes)) {
    const values = minutes.split(',').map((v) => v.trim());
    if (values.length === 2) {
      const firstValue = values[0];
      const secondValue = values[1];
      return t`pada menit ${firstValue} dan ${secondValue}`;
    }
    const lastValue = values.pop();
    const remainingValues = values.join(', ');
    return t`pada menit ${remainingValues} dan ${lastValue}`;
  }

  const minuteNum = parseInt(minutes, 10);
  if (!isNaN(minuteNum)) {
    if (minuteNum === 0) {
      return t`tepat di awal jam`;
    }
    if (minuteNum === 1) {
      return t`pada menit ke-1 setiap jam`;
    }
    const minuteNumStr = minuteNum.toString();
    return t`pada menit ke-${minuteNumStr} setiap jam`;
  }

  return minutes;
};
