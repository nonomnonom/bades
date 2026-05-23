import { gql } from '@apollo/client';

export const AGENT_FRAGMENT = gql`
  fragment AgentFields on Agent {
    id
    name
    label
    description
    icon
    prompt
    responseFormat
    roleId
    isCustom
    evaluationInputs
    applicationId
    createdAt
    updatedAt
  }
`;
