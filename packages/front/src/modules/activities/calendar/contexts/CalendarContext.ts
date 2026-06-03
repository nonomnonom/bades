import { createContext } from 'react';

import { type TimelineCalendarEvent } from '@/activities/calendar/types/TimelineCalendarEvent';

type CalendarContextValue = {
  calendarEventsByDayTime: Record<number, TimelineCalendarEvent[] | undefined>;
};

export const CalendarContext = createContext<CalendarContextValue>({
  calendarEventsByDayTime: {},
});
