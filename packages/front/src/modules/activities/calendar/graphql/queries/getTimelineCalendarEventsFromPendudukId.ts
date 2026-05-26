import { timelineCalendarEventWithTotalFragment } from '@/activities/calendar/graphql/queries/fragments/timelineCalendarEventWithTotalFragment';
import { gql } from '@apollo/client';

export const getTimelineCalendarEventsFromPendudukId = gql`
  query GetTimelineCalendarEventsFromPendudukId(
    $pendudukId: UUID!
    $page: Int!
    $pageSize: Int!
  ) {
    getTimelineCalendarEventsFromPendudukId(
      pendudukId: $pendudukId
      page: $page
      pageSize: $pageSize
    ) {
      ...TimelineCalendarEventsWithTotalFragment
    }
  }
  ${timelineCalendarEventWithTotalFragment}
`;
