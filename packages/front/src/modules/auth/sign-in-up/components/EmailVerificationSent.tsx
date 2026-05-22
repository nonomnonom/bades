import { styled } from '@linaria/react';

import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useHandleResendEmailVerificationToken } from '@/auth/sign-in-up/hooks/useHandleResendEmailVerificationToken';
import {
  SignInUpStep,
  signInUpStepState,
} from '@/auth/states/signInUpStepState';
import { OnboardingModalCircularIcon } from '@/onboarding/components/OnboardingModalCircularIcon';
import { t } from '~/utils/i18n/badesI18n';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import {
  IconGmail,
  IconMail,
  IconMailX,
  IconMicrosoft,
} from 'ui/display';
import { MainButton } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';
import { AnimatedEaseIn } from 'ui/utilities';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[8]};
  width: 100%;
`;

const StyledTextContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const StyledEmail = styled.span`
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledButtonsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  max-width: 240px;
  width: 100%;
`;

const StyledBottomLinks = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
`;

const StyledLinkButton = styled.button`
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.regular};
  line-height: 140%;

  &:hover {
    color: ${themeCssVariables.font.color.secondary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledDot = styled.div`
  background: ${themeCssVariables.font.color.light};
  border-radius: 50%;
  height: 2px;
  width: 2px;
`;

export const EmailVerificationSent = ({
  email,
  isError = false,
}: {
  email: string | null;
  isError?: boolean;
}) => {
  const setSignInUpStep = useSetAtomState(signInUpStepState);

  const { handleResendEmailVerificationToken, loading: isLoading } =
    useHandleResendEmailVerificationToken();

  const handleOpenGmail = () => {
    const gmailUrl = email
      ? `https://mail.google.com/mail/u/${email}/`
      : 'https://mail.google.com/';
    window.open(gmailUrl, '_blank');
  };

  const handleOpenOutlook = () => {
    const outlookUrl = email
      ? `https://outlook.live.com/mail/${email}/`
      : 'https://outlook.live.com/';
    window.open(outlookUrl, '_blank');
  };

  const handleChangeEmail = () => {
    setSignInUpStep(SignInUpStep.Email);
  };

  const title = isError
    ? t`Verifikasi Email Gagal`
    : t`Periksa Email Anda`;
  const subtitle = isError
    ? t`Kami menemui kendala saat memverifikasi`
    : t`Email verifikasi telah dikirim ke`;

  const Icon = isError ? IconMailX : IconMail;

  const mainButtons = isError ? (
    <>
      <MainButton
        title={t`Coba dengan email lain`}
        onClick={handleChangeEmail}
        variant="secondary"
        fullWidth
      />
      <MainButton
        title={isLoading ? t`Mengirim...` : t`Kirim ulang email`}
        onClick={handleResendEmailVerificationToken(email)}
        disabled={isLoading}
        fullWidth
      />
    </>
  ) : (
    <>
      <MainButton
        title={t`Buka Gmail`}
        onClick={handleOpenGmail}
        Icon={IconGmail}
        variant="secondary"
        fullWidth
      />
      <MainButton
        title={t`Buka Outlook`}
        onClick={handleOpenOutlook}
        Icon={IconMicrosoft}
        variant="secondary"
        fullWidth
      />
    </>
  );

  return (
    <StyledContainer>
      <AnimatedEaseIn>
        <OnboardingModalCircularIcon Icon={Icon} />
      </AnimatedEaseIn>

      <StyledTextContainer>
        <Title animate noMarginTop>
          {title}
        </Title>
        <SubTitle>
          {subtitle} <StyledEmail>{email}</StyledEmail>
        </SubTitle>
      </StyledTextContainer>

      <StyledButtonsContainer>{mainButtons}</StyledButtonsContainer>

      {!isError && (
        <StyledBottomLinks>
          <StyledLinkButton
            onClick={handleResendEmailVerificationToken(email)}
            disabled={isLoading}
          >
            {isLoading ? t`Mengirim...` : t`Kirim ulang email`}
          </StyledLinkButton>
          <StyledDot />
          <StyledLinkButton onClick={handleChangeEmail}>
            {t`Ganti email`}
          </StyledLinkButton>
        </StyledBottomLinks>
      )}
    </StyledContainer>
  );
};
