import { useLingui } from '~/utils/i18n/badesI18n';
import { useSignInUp } from '@/auth/sign-in-up/hooks/useSignInUp';
import { useSignInUpForm } from '@/auth/sign-in-up/hooks/useSignInUpForm';
import {
  SignInUpStep,
  signInUpStepState,
} from '@/auth/states/signInUpStepState';
import { workspacePublicDataState } from '@/auth/states/workspacePublicDataState';
import { styled } from '@linaria/react';

import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';

import { Logo } from '@/auth/components/Logo';
import { Title } from '@/auth/components/Title';
import { EmailVerificationSent } from '@/auth/sign-in-up/components/EmailVerificationSent';
import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { SignInUpGlobalScopeForm } from '@/auth/sign-in-up/components/SignInUpGlobalScopeForm';
import { SignInUpWorkspaceScopeForm } from '@/auth/sign-in-up/components/SignInUpWorkspaceScopeForm';
import { SignInUpSSOIdentityProviderSelection } from '@/auth/sign-in-up/components/internal/SignInUpSSOIdentityProviderSelection';
import { SignInUpWorkspaceScopeFormEffect } from '@/auth/sign-in-up/components/internal/SignInUpWorkspaceScopeFormEffect';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useGetPublicWorkspaceDataByDomain } from '@/domain-manager/hooks/useGetPublicWorkspaceDataByDomain';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useIsCurrentLocationOnDefaultDomain } from '@/domain-manager/hooks/useIsCurrentLocationOnDefaultDomain';
import { useMemo } from 'react';

import { SignInUpGlobalScopeFormEffect } from '@/auth/sign-in-up/components/internal/SignInUpGlobalScopeFormEffect';
import { SignInUpTwoFactorAuthenticationProvision } from '@/auth/sign-in-up/components/internal/SignInUpTwoFactorAuthenticationProvision';
import { SignInUpTOTPVerification } from '@/auth/sign-in-up/components/internal/SignInUpTwoFactorAuthenticationVerification';
import { useWorkspaceFromInviteHash } from '@/auth/sign-in-up/hooks/useWorkspaceFromInviteHash';
import { clientConfigApiStatusState } from '@/client-config/states/clientConfigApiStatusState';
import { ModalContent } from 'ui/layout';
import { useSearchParams } from 'react-router-dom';
import { isDefined } from 'shared/utils';
import { Loader } from 'ui/feedback';
import { themeCssVariables } from 'ui/theme-constants';
import { AnimatedEaseIn } from 'ui/utilities';
import { type PublicWorkspaceData } from '~/generated-metadata/graphql';

const StyledLoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: ${themeCssVariables.spacing[8]};
  margin-top: ${themeCssVariables.spacing[8]};
  width: 100%;
`;

const StandardContent = ({
  workspacePublicData,
  signInUpForm,
  signInUpStep,
  title,
  onClickOnLogo,
}: {
  workspacePublicData: PublicWorkspaceData | null;
  signInUpForm: JSX.Element | null;
  signInUpStep: SignInUpStep;
  title: string;
  onClickOnLogo: () => void;
}) => {
  return (
    <ModalContent isVerticallyCentered isHorizontallyCentered>
      <AnimatedEaseIn>
        <Logo
          secondaryLogo={workspacePublicData?.logo}
          placeholder={workspacePublicData?.displayName}
          onClick={onClickOnLogo}
        />
      </AnimatedEaseIn>
      <Title animate>{title}</Title>
      {signInUpForm}
      {![
        SignInUpStep.Password,
        SignInUpStep.TwoFactorAuthenticationProvision,
        SignInUpStep.TwoFactorAuthenticationVerification,
        SignInUpStep.WorkspaceSelection,
      ].includes(signInUpStep) && <FooterNote />}
    </ModalContent>
  );
};

export const SignInUp = () => {
  const { t } = useLingui();
  const setSignInUpStep = useSetAtomState(signInUpStepState);
  const clientConfigApiStatus = useAtomStateValue(clientConfigApiStatusState);

  const { form } = useSignInUpForm();
  const { signInUpStep } = useSignInUp(form);
  const { isDefaultDomain } = useIsCurrentLocationOnDefaultDomain();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const workspacePublicData = useAtomStateValue(workspacePublicDataState);
  const { loading: getPublicWorkspaceDataLoading } =
    useGetPublicWorkspaceDataByDomain();
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const { workspaceInviteHash, workspace: workspaceFromInviteHash } =
    useWorkspaceFromInviteHash();

  const [searchParams] = useSearchParams();

  const onClickOnLogo = () => {
    setSignInUpStep(SignInUpStep.Init);
  };

  const isGlobalScope = isDefaultDomain && isMultiWorkspaceEnabled;

  const title = useMemo(() => {
    if (isDefined(workspaceInviteHash)) {
      const workspaceName = workspaceFromInviteHash?.displayName ?? '';
      return t`Bergabung dengan tim ${workspaceName}`;
    }

    if (signInUpStep === SignInUpStep.WorkspaceSelection) {
      return t`Pilih Desa`;
    }

    if (signInUpStep === SignInUpStep.TwoFactorAuthenticationProvision) {
      return t`Atur autentikasi dua faktor`;
    }

    if (signInUpStep === SignInUpStep.TwoFactorAuthenticationVerification) {
      return t`Masukkan kode dari aplikasi`;
    }

    if (isGlobalScope) {
      return t`Welcome to Bades.id`;
    }

    const workspaceName = workspacePublicData?.displayName;

    if (!workspaceName) {
      return t`Selamat datang di ruang kerja Anda`;
    }

    return t`Selamat datang, ${workspaceName}.`;
  }, [
    workspaceInviteHash,
    signInUpStep,
    workspacePublicData?.displayName,
    isGlobalScope,
    t,
    workspaceFromInviteHash?.displayName,
  ]);

  const signInUpForm = useMemo(() => {
    if (getPublicWorkspaceDataLoading || !clientConfigApiStatus.isLoadedOnce) {
      return (
        <StyledLoaderContainer>
          <Loader color="gray" />
        </StyledLoaderContainer>
      );
    }

    if (isDefaultDomain && isMultiWorkspaceEnabled) {
      return (
        <>
          <SignInUpGlobalScopeFormEffect />
          <SignInUpGlobalScopeForm />
        </>
      );
    }

    if (
      isOnAWorkspace &&
      signInUpStep === SignInUpStep.SSOIdentityProviderSelection
    ) {
      return <SignInUpSSOIdentityProviderSelection />;
    }

    if (signInUpStep === SignInUpStep.TwoFactorAuthenticationProvision) {
      return <SignInUpTwoFactorAuthenticationProvision />;
    }

    if (signInUpStep === SignInUpStep.TwoFactorAuthenticationVerification) {
      return <SignInUpTOTPVerification />;
    }

    if (isDefined(workspacePublicData) && isOnAWorkspace) {
      return (
        <>
          <SignInUpWorkspaceScopeFormEffect />
          <SignInUpWorkspaceScopeForm />
        </>
      );
    }

    return (
      <>
        <SignInUpGlobalScopeFormEffect />
        <SignInUpGlobalScopeForm />
      </>
    );
  }, [
    clientConfigApiStatus.isLoadedOnce,
    isDefaultDomain,
    isMultiWorkspaceEnabled,
    isOnAWorkspace,
    getPublicWorkspaceDataLoading,
    signInUpStep,
    workspacePublicData,
  ]);

  if (signInUpStep === SignInUpStep.EmailVerification) {
    return (
      <ModalContent isVerticallyCentered isHorizontallyCentered>
        <EmailVerificationSent email={searchParams.get('email')} />
      </ModalContent>
    );
  }

  return (
    <StandardContent
      workspacePublicData={workspacePublicData}
      signInUpForm={signInUpForm}
      signInUpStep={signInUpStep}
      title={title}
      onClickOnLogo={onClickOnLogo}
    />
  );
};
