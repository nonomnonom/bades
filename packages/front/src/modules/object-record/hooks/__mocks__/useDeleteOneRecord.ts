import { gql } from '@apollo/client';

export const query = gql`
  mutation DeleteOnePenduduk($idToDelete: UUID!) {
    deletePenduduk(id: $idToDelete) {
      __typename
      deletedAt
      id
    }
  }
`;
