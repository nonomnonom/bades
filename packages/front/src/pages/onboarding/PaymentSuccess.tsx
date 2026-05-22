import { t } from '~/utils/i18n/badesI18n';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { currentUserState } from '@/auth/states/currentUserState';
import { OnboardingModalCircularIcon } from '@/onboarding/components/OnboardingModalCircularIcon';
import { ModalContent } from 'ui/layout';
import { useSubscriptionStatus } from '@/workspace/hooks/useSubscriptionStatus';
import { styled } from '@linaria/react';
import { useState } from 'react';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { AppPath } from 'shared/types';
import { isDefined } from 'shared/utils';
import { IconCheck } from 'ui/display';
import { Loader } from 'ui/feedback';
import { MainButton } from 'ui/input';
import { AnimatedEaseIn } from 'ui/utilities';
import { useLazyQuery } from '@apollo/client/react';
import { GetCurrentUserDocument } from '~/generated-metadata/graphql';
import { useNavigateApp } from '~/hooks/useNavigateApp';

const StyledTitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const PaymentSuccess = () => {
  const navigate = useNavigateApp();
  const subscriptionStatus = useSubscriptionStatus();
  const [getCurrentUser] = useLazyQuery(GetCurrentUserDocument, {
    fetchPolicy: 'network-only',
  });
  const setCurrentUser = useSetAtomState(currentUserState);
  const [isLoading, setIsLoading] = useState(false);
  const navigateWithSubscriptionCheck = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isDefined(subscriptionStatus)) {
        navigate(AppPath.CreateWorkspace);
        return;
      }

      const result = await getCurrentUser();
      const currentUser = result.data?.currentUser;
      const refreshedSubscriptionStatus =
        currentUser?.currentWorkspace?.currentBillingSubscription?.status;

      if (isDefined(currentUser) && isDefined(refreshedSubscriptionStatus)) {
        setCurrentUser(currentUser);
        navigate(AppPath.CreateWorkspace);
        return;
      }

      throw new Error(
        t`Menunggu konfirmasi dari penyedia pembayaran.\nSilakan coba lagi dalam beberapa detik.`,
      );
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <ModalContent gap={8} isVerticallyCentered isHorizontallyCentered>
      <AnimatedEaseIn>
        <OnboardingModalCircularIcon Icon={IconCheck} />
      </AnimatedEaseIn>
      <StyledTitleContainer>
        <Title noMarginTop>{t`Siap digunakan!`}</Title>
        <SubTitle>{t`Akun Anda telah berhasil diaktifkan.`}</SubTitle>
      </StyledTitleContainer>
      <MainButton
        title={t`Mulai`}
        width={200}
        onClick={navigateWithSubscriptionCheck}
        Icon={() => (isLoading ? <Loader /> : null)}
        disabled={isLoading}
      />
    </ModalContent>
  );
};
