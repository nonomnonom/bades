import { gql } from '@apollo/client';

export const query = gql`
  mutation DeleteOnePerson($idToDelete: UUID!) {
    deletePenduduk(id: $idToDelete) {
      __typename
      deletedAt
      id
    }
  }
`;
