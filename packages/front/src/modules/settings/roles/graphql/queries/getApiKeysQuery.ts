import { gql } from '@apollo/client';

export const GET_API_KEYS = gql`
  query GetApiKeys {
    apiKeys {
      id
      name
      expiresAt
      revokedAt
    }
  }
`;
