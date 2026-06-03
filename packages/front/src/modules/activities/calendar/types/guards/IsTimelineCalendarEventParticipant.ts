import { type CalendarEventParticipant } from '@/activities/calendar/types/CalendarEventParticipant';
import { type TimelineCalendarEventParticipant } from '@/activities/calendar/types/TimelineCalendarEvent';

export const isTimelineCalendarEventParticipant = (
  participant: CalendarEventParticipant | TimelineCalendarEventParticipant,
): participant is TimelineCalendarEventParticipant => {
  return 'avatarUrl' in participant;
};
