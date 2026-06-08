import { useParams, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/auth/hooks/useAuth';
import { type SocialSSOSignInUpActionType } from '@/auth/types/socialSSOSignInUp.type';
import {
  BillingPlanKey,
  SubscriptionInterval,
} from '~/generated-metadata/graphql';

const DEFAULT_BILLING_CHECKOUT_SESSION = {
  plan: BillingPlanKey.PRO,
  interval: SubscriptionInterval.Month,
  requirePaymentMethod: true,
} as const;

export const useSignInWithGoogle = () => {
  const workspaceInviteHash = useParams().workspaceInviteHash;
  const [searchParams] = useSearchParams();
  const workspacePersonalInviteToken =
    searchParams.get('inviteToken') ?? undefined;

  const { signInWithGoogle } = useAuth();

  return {
    signInWithGoogle: ({ action }: { action: SocialSSOSignInUpActionType }) =>
      signInWithGoogle({
        workspaceInviteHash,
        workspacePersonalInviteToken,
        billingCheckoutSession: DEFAULT_BILLING_CHECKOUT_SESSION,
        action,
      }),
  };
};
