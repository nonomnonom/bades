import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { ModalContent } from 'ui/layout';
import { styled } from '@linaria/react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Link } from 'react-router-dom';
import { AppPath } from 'shared/types';
import { LightButton, MainButton } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';
import { useMutation } from '@apollo/client/react';
import { SkipBookOnboardingStepDocument } from '~/generated-metadata/graphql';

const StyledCoverImage = styled.img`
  border-radius: ${themeCssVariables.border.radius.sm};
  height: 204px;
  object-fit: cover;
  width: 320px;
`;

const StyledTitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledButtonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledLinkContainer = styled.div`
  > a {
    text-decoration: none;
  }
`;

export const BookCallDecision = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [skipBookOnboardingStepMutation] = useMutation(
    SkipBookOnboardingStepDocument,
  );

  const handleFinish = async () => {
    await skipBookOnboardingStepMutation();
    setNextOnboardingStatus();
  };

  return (
    <ModalContent gap={8} isVerticallyCentered isHorizontallyCentered>
      <StyledTitleContainer>
        <Title noMarginTop>
          <Trans>Jadwalkan sesi orientasi</Trans>
        </Title>
        <SubTitle>
          <Trans>
            Tim kami dapat membantu menyiapkan ruang kerja Anda sesuai
            kebutuhan dan alur kerja administrasi desa.
          </Trans>
        </SubTitle>
      </StyledTitleContainer>
      <StyledCoverImage src="/images/placeholders/onboarding-covers/onboarding-book-call-decision-cover.png" />
      <StyledButtonContainer>
        <StyledLinkContainer>
          <Link to={AppPath.BookCall}>
            <MainButton title={t`Jadwalkan sekarang`} width={198} />
          </Link>
        </StyledLinkContainer>
        <LightButton title={t`Selesai`} onClick={handleFinish} />
      </StyledButtonContainer>
    </ModalContent>
  );
};
