import { timelineThreadWithTotalFragment } from '@/activities/emails/graphql/queries/fragments/timelineThreadWithTotalFragment';
import { gql } from '@apollo/client';

export const getTimelineThreadsFromKeluargaId = gql`
  query GetTimelineThreadsFromKeluargaId(
    $keluargaId: UUID!
    $page: Int!
    $pageSize: Int!
  ) {
    getTimelineThreadsFromKeluargaId(
      keluargaId: $keluargaId
      page: $page
      pageSize: $pageSize
    ) {
      ...TimelineThreadsWithTotalFragment
    }
  }
  ${timelineThreadWithTotalFragment}
`;
