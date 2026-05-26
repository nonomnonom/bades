import { gql } from '@apollo/client';

import { timelineCalendarEventWithTotalFragment } from '@/activities/calendar/graphql/queries/fragments/timelineCalendarEventWithTotalFragment';

export const getTimelineCalendarEventsFromProgramBantuanId = gql`
  query GetTimelineCalendarEventsFromProgramBantuanId(
    $programBantuanId: UUID!
    $page: Int!
    $pageSize: Int!
  ) {
    getTimelineCalendarEventsFromProgramBantuanId(
      programBantuanId: $programBantuanId
      page: $page
      pageSize: $pageSize
    ) {
      ...TimelineCalendarEventsWithTotalFragment
    }
  }
  ${timelineCalendarEventWithTotalFragment}
`;
