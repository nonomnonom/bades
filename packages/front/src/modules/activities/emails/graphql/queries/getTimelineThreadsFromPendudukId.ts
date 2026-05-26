import { gql } from '@apollo/client';

import { timelineThreadWithTotalFragment } from '@/activities/emails/graphql/queries/fragments/timelineThreadWithTotalFragment';

export const getTimelineThreadsFromPendudukId = gql`
  query GetTimelineThreadsFromPendudukId(
    $pendudukId: UUID!
    $page: Int!
    $pageSize: Int!
  ) {
    getTimelineThreadsFromPendudukId(
      pendudukId: $pendudukId
      page: $page
      pageSize: $pageSize
    ) {
      ...TimelineThreadsWithTotalFragment
    }
  }
  ${timelineThreadWithTotalFragment}
`;
