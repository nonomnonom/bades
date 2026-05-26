import { timelineCalendarEventWithTotalFragment } from '@/activities/calendar/graphql/queries/fragments/timelineCalendarEventWithTotalFragment';
import { gql } from '@apollo/client';

export const getTimelineCalendarEventsFromKeluargaId = gql`
  query GetTimelineCalendarEventsFromKeluargaId(
    $keluargaId: UUID!
    $page: Int!
    $pageSize: Int!
  ) {
    getTimelineCalendarEventsFromKeluargaId(
      keluargaId: $keluargaId
      page: $page
      pageSize: $pageSize
    ) {
      ...TimelineCalendarEventsWithTotalFragment
    }
  }
  ${timelineCalendarEventWithTotalFragment}
`;
