import { gql } from '@apollo/client';

import { timelineThreadWithTotalFragment } from '@/activities/emails/graphql/queries/fragments/timelineThreadWithTotalFragment';

export const getTimelineThreadsFromProgramBantuanId = gql`
  query GetTimelineThreadsFromProgramBantuanId(
    $programBantuanId: UUID!
    $page: Int!
    $pageSize: Int!
  ) {
    getTimelineThreadsFromProgramBantuanId(
      programBantuanId: $programBantuanId
      page: $page
      pageSize: $pageSize
    ) {
      ...TimelineThreadsWithTotalFragment
    }
  }
  ${timelineThreadWithTotalFragment}
`;
