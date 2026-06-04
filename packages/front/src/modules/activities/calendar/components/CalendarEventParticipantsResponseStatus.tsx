import groupBy from 'lodash.groupby';

import { CalendarEventParticipantsResponseStatusField } from '@/activities/calendar/components/CalendarEventParticipantsResponseStatusField';
import { type CalendarEventParticipant } from '@/activities/calendar/types/CalendarEventParticipant';

type CalendarResponseStatus = 'Ya' | 'Mungkin' | 'Tidak';

const RESPONSE_STATUS_ORDER: CalendarResponseStatus[] = [
  'Ya',
  'Mungkin',
  'Tidak',
];

export const CalendarEventParticipantsResponseStatus = ({
  participants,
}: {
  participants: CalendarEventParticipant[];
}) => {
  const groupedParticipants = groupBy(participants, (participant) => {
    switch (participant.responseStatus) {
      case 'ACCEPTED':
        return 'Ya';
      case 'DECLINED':
        return 'Tidak';
      case 'NEEDS_ACTION':
      case 'TENTATIVE':
        return 'Mungkin';
      default:
        return '';
    }
  });

  return (
    <>
      {RESPONSE_STATUS_ORDER.map((responseStatus) => (
        <CalendarEventParticipantsResponseStatusField
          key={responseStatus}
          responseStatus={responseStatus}
          participants={groupedParticipants[responseStatus] ?? []}
        />
      ))}
    </>
  );
};
