import { gql } from '@apollo/client';

import { timelineThreadWithTotalFragment } from '@/activities/emails/graphql/queries/fragments/timelineThreadWithTotalFragment';

export const getTimelineThreadsFromProgramBantuanId = gql`
  query GetTimelineThreadsFromOpportunityId(
    $opportunityId: UUID!
    $page: Int!
    $pageSize: Int!
  ) {
    getTimelineThreadsFromProgramBantuanId(
      opportunityId: $opportunityId
      page: $page
      pageSize: $pageSize
    ) {
      ...TimelineThreadsWithTotalFragment
    }
  }
  ${timelineThreadWithTotalFragment}
`;
