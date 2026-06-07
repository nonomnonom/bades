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
      ? `Minggu`
      : systemCalendarStartDay === CalendarStartDay.MONDAY
        ? `Senin`
        : `Sabtu`;

  const options: SelectOption<CalendarStartDay>[] = useMemo(
    () => [
      { label: `Minggu`, value: CalendarStartDay.SUNDAY },
      { label: `Senin`, value: CalendarStartDay.MONDAY },
      { label: `Sabtu`, value: CalendarStartDay.SATURDAY },
    ],
    [],
  );

  return (
    <Select
      dropdownId="datetime-settings-calendar-start-day"
      dropdownWidth={218}
      label={`Hari awal kalender`}
      fullWidth
      dropdownWidthAuto
      value={value}
      pinnedOption={{
        label: `Ikuti sistem`,
        value: CalendarStartDay.SYSTEM,
        contextualText: systemDayContextualText,
      }}
      options={options}
      onChange={onChange}
    />
  );
};
