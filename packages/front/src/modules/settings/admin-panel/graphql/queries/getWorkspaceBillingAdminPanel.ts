import { gql } from '@apollo/client';

export const GET_WORKSPACE_BILLING_ADMIN_PANEL = gql`
  query WorkspaceBillingAdminPanel($workspaceId: UUID!) {
    workspaceBillingAdminPanel(workspaceId: $workspaceId) {
      billingCustomerId
      creditBalance
      subscription {
        subscriptionId
        status
        interval
        currency
        planKey
        currentPeriodStart
        currentPeriodEnd
        trialStart
        trialEnd
        cancelAt
        canceledAt
        cancelAtPeriodEnd
        items {
          productName
          productKey
          priceId
          quantity
          unitAmount
          includedCredits
        }
      }
    }
  }
`;
