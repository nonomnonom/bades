import { t } from '~/utils/i18n/badesI18n';
import { useMemo } from 'react';

import { detectCalendarStartDay } from '@/localization/utils/detection/detectCalendarStartDay';
import { Select } from '@/ui/input/components/Select';
import { CalendarStartDay } from 'shared/constants';
import { type SelectOption } from 'ui/input';

type DateTimeSettingsCalendarStartDaySelectProps = {
  value: CalendarStartDay;
  onChange: (nextValue: CalendarStartDay) => void;
};

export const DateTimeSettingsCalendarStartDaySelect = ({
  value,
  onChange,
}: DateTimeSettingsCalendarStartDaySelectProps) => {
  const systemCalendarStartDay = CalendarStartDay[detectCalendarStartDay()];

  const systemDayContextualText =
    systemCalendarStartDay === CalendarStartDay.SUNDAY
      ? t`Minggu`
      : systemCalendarStartDay === CalendarStartDay.MONDAY
        ? t`Senin`
        : t`Sabtu`;

  const options: SelectOption<CalendarStartDay>[] = useMemo(
    () => [
      { label: t`Minggu`, value: CalendarStartDay.SUNDAY },
      { label: t`Senin`, value: CalendarStartDay.MONDAY },
      { label: t`Sabtu`, value: CalendarStartDay.SATURDAY },
    ],
    [],
  );

  return (
    <Select
      dropdownId="datetime-settings-calendar-start-day"
      dropdownWidth={218}
      label={t`Hari awal kalender`}
      fullWidth
      dropdownWidthAuto
      value={value}
      pinnedOption={{
        label: t`Ikuti sistem`,
        value: CalendarStartDay.SYSTEM,
        contextualText: systemDayContextualText,
      }}
      options={options}
      onChange={onChange}
    />
  );
};
