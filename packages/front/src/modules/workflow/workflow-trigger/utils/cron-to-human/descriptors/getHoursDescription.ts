import { t } from '~/utils/i18n/badesI18n';
import { isDefined } from 'shared/utils';

import { formatTime as formatCronTime } from '~/utils/format/formatTime';
import { isListValue } from '~/utils/validation/isListValue';
import { isNumericRange } from '~/utils/validation/isNumericRange';
import { isStepValue } from '~/utils/validation/isStepValue';
import { type CronDescriptionOptions } from '@/workflow/workflow-trigger/utils/cron-to-human/types/cronDescriptionOptions';

export const getHoursDescription = (
  hours: string,
  minutes: string,
  options: CronDescriptionOptions,
): string => {
  if (!isDefined(hours) || hours.trim() === '') {
    return '';
  }

  const use24Hour = options.use24HourTimeFormat ?? true;

  if (hours === '*') {
    return t`setiap jam`;
  }

  if (isStepValue(hours)) {
    const [range, step] = hours.split('/');
    const stepNum = parseInt(step, 10);

    if (range === '*') {
      if (stepNum === 1) {
        return t`setiap jam`;
      }
      const stepNumStr = stepNum.toString();
      return t`setiap ${stepNumStr} jam`;
    }

    if (range.includes('-')) {
      const [start, end] = range.split('-');
      const stepNumStr = stepNum.toString();
      const startTime = formatCronTime({
        hour: start,
        minute: '0',
        use24HourFormat: use24Hour,
        appendUTC: true,
      });
      const endTime = formatCronTime({
        hour: end,
        minute: '0',
        use24HourFormat: use24Hour,
        appendUTC: true,
      });
      return t`setiap ${stepNumStr} jam, antara ${startTime} dan ${endTime}`;
    }

    const stepNumStr = stepNum.toString();
    return t`setiap ${stepNumStr} jam`;
  }

  if (isNumericRange(hours) && hours.includes('-')) {
    const [start, end] = hours.split('-');
    const startTime = formatCronTime({
      hour: start,
      minute: '0',
      use24HourFormat: use24Hour,
      appendUTC: true,
    });
    const endTime = formatCronTime({
      hour: end,
      minute: '0',
      use24HourFormat: use24Hour,
      appendUTC: true,
    });
    return t`antara ${startTime} dan ${endTime}`;
  }

  if (isListValue(hours)) {
    const values = hours.split(',').map((v) => v.trim());
    const formattedTimes = values.map((hour) =>
      formatCronTime({
        hour,
        minute: minutes || '0',
        use24HourFormat: use24Hour,
        appendUTC: true,
      }),
    );

    if (formattedTimes.length === 2) {
      const firstTime = formattedTimes[0];
      const secondTime = formattedTimes[1];
      return t`pukul ${firstTime} dan ${secondTime}`;
    }
    const lastTime = formattedTimes.pop();
    const remainingTimes = formattedTimes.join(', ');
    return t`pukul ${remainingTimes} dan ${lastTime}`;
  }

  const hourNum = parseInt(hours, 10);
  if (!isNaN(hourNum)) {
    const formattedTime = formatCronTime({
      hour: hours,
      minute: minutes || '0',
      use24HourFormat: use24Hour,
      appendUTC: true,
    });
    return t`pukul ${formattedTime}`;
  }

  return hours;
};
