import { gql } from '@apollo/client';

export const GET_MIDTRANS_TRANSACTION_STATUS = gql`
  query GetMidtransTransactionStatus($orderId: String!) {
    getMidtransTransactionStatus(orderId: $orderId) {
      orderId
      transactionType
      transactionStatus
      grossAmount
      paymentType
    }
  }
`;
