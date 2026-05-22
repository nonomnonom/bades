import { gql } from '@apollo/client';

export const CREATE_TOP_UP_CREDIT_SESSION = gql`
  mutation CreateTopUpCreditSession(
    $grossAmount: Int!
    $itemName: String!
    $callbackFinishUrl: String
  ) {
    createTopUpCreditSession(
      grossAmount: $grossAmount
      itemName: $itemName
      callbackFinishUrl: $callbackFinishUrl
    ) {
      url
      orderId
    }
  }
`;
