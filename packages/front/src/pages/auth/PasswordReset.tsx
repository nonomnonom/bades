import { i18n } from '~/utils/i18n/badesI18n';
import { SKELETON_LOADER_HEIGHT_SIZES } from '@/activities/const/skeleton-loader-height-sizes.const';
import { Logo } from '@/auth/components/Logo';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { useHasAccessTokenPair } from '@/auth/hooks/useHasAccessTokenPair';
import { currentUserState } from '@/auth/states/currentUserState';
import { workspacePublicDataState } from '@/auth/states/workspacePublicDataState';
import { PASSWORD_REGEX } from '@/auth/utils/passwordRegex';
import { useReadCaptchaToken } from '@/captcha/hooks/useReadCaptchaToken';
import { useCaptcha } from '@/client-config/hooks/useCaptcha';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { TextInput } from '@/ui/input/components/TextInput';
import { ModalContent } from 'ui/layout';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isNonEmptyString } from '@sniptt/guards';
import { m } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { AppPath } from 'shared/types';
import { MainButton } from 'ui/input';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';
import { AnimatedEaseIn } from 'ui/utilities';
import { z } from 'zod';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  UpdatePasswordViaResetTokenDocument,
  ValidatePasswordResetTokenDocument,
} from '~/generated-metadata/graphql';
import { useNavigateApp } from '~/hooks/useNavigateApp';
import { logError } from '~/utils/logError';

const passwordLengthMessage = `Kata sandi harus terdiri dari 8 hingga 50 karakter`;

const validationSchema = z
  .object({
    passwordResetToken: z.string(),
    newPassword: z
      .string()
      .regex(PASSWORD_REGEX, i18n._(passwordLengthMessage)),
  })
  .required();

type Form = z.infer<typeof validationSchema>;

const StyledMainContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const StyledContentContainer = styled.div`
  margin-bottom: ${themeCssVariables.spacing[8]};
  margin-top: ${themeCssVariables.spacing[4]};
  width: 200px;
`;

const StyledForm = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledFullWidthContainer = styled.div`
  width: 100%;
`;

const StyledInputContainer = styled.div`
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledMainButtonContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const PasswordReset = () => {
  const { theme } = useContext(ThemeContext);
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();

  const workspacePublicData = useAtomStateValue(workspacePublicDataState);
  const setCurrentUser = useSetAtomState(currentUserState);

  const navigate = useNavigateApp();
  const { redirect } = useRedirect();

  const [email, setEmail] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isTargetUserPasswordSet, setIsTargetUserPasswordSet] = useState(false);
  const passwordResetToken = useParams().passwordResetToken;

  const hasAccessTokenPair = useHasAccessTokenPair();

  const { control, handleSubmit } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      passwordResetToken: passwordResetToken ?? '',
      newPassword: '',
    },
    resolver: zodResolver(validationSchema),
  });

  const { data: tokenValidationData, error: tokenValidationError } = useQuery(
    ValidatePasswordResetTokenDocument,
    {
      variables: {
        token: passwordResetToken ?? '',
      },
      skip: !passwordResetToken || isTokenValid,
    },
  );

  useEffect(() => {
    if (tokenValidationError) {
      enqueueErrorSnackBar({
        apolloError: tokenValidationError,
      });
      navigate(AppPath.Index);
    }
  }, [tokenValidationError, enqueueErrorSnackBar, navigate]);

  useEffect(() => {
    if (tokenValidationData) {
      setIsTokenValid(true);
      const validationResult = tokenValidationData?.validatePasswordResetToken;
      if (isNonEmptyString(validationResult?.email)) {
        setEmail(validationResult.email);
      }
      if (validationResult?.hasPassword) {
        setIsTargetUserPasswordSet(validationResult.hasPassword);
      }
    }
  }, [tokenValidationData]);

  const [updatePasswordViaToken, { loading: isUpdatingPassword }] = useMutation(
    UpdatePasswordViaResetTokenDocument,
  );

  const { signInWithCredentialsInWorkspace, signInWithCredentials } = useAuth();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const { readCaptchaToken } = useReadCaptchaToken();
  const { isCaptchaReady } = useCaptcha();

  const onSubmit = async (formData: Form) => {
    try {
      const { data } = await updatePasswordViaToken({
        variables: {
          token: formData.passwordResetToken,
          newPassword: formData.newPassword,
        },
      });

      if (!data?.updatePasswordViaResetToken.success) {
        enqueueErrorSnackBar({
          message: `Terjadi kesalahan saat memperbarui kata sandi.`,
        });
        return;
      }

      const successMessage =
        isTargetUserPasswordSet === false
          ? `Kata sandi berhasil disetel`
          : `Kata sandi berhasil diperbarui`;

      setCurrentUser((currentUser) =>
        currentUser ? { ...currentUser, hasPassword: true } : currentUser,
      );

      if (hasAccessTokenPair) {
        enqueueSuccessSnackBar({
          message: successMessage,
        });
        navigate(AppPath.Index);
        return;
      }

      if (!isCaptchaReady) {
        enqueueErrorSnackBar({
          message: `Captcha (pemeriksaan anti-bot) masih dimuat, coba lagi`,
        });
        return;
      }

      const token = readCaptchaToken();

      if (isOnAWorkspace) {
        await signInWithCredentialsInWorkspace(
          email || '',
          formData.newPassword,
          token,
        );
      } else {
        await signInWithCredentials(email || '', formData.newPassword, token);
      }

      redirect(AppPath.Index);
    } catch (err) {
      logError(err);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(err) ? err : undefined,
      });
    }
  };

  const passwordActionLabel =
    isTargetUserPasswordSet === true ? `Ubah Kata Sandi` : `Setel Kata Sandi`;

  return (
    isTokenValid && (
      <ModalContent isVerticallyCentered isHorizontallyCentered>
        <StyledMainContainer>
          <AnimatedEaseIn>
            <Logo
              secondaryLogo={workspacePublicData?.logo}
              placeholder={workspacePublicData?.displayName}
            />
          </AnimatedEaseIn>
          <Title animate>{passwordActionLabel}</Title>
          <StyledContentContainer>
            {!email ? (
              <SkeletonTheme
                baseColor={theme.background.quaternary}
                highlightColor={theme.background.secondary}
              >
                <Skeleton
                  height={SKELETON_LOADER_HEIGHT_SIZES.standard.m}
                  count={2}
                  style={{
                    marginBottom: themeCssVariables.spacing[2],
                  }}
                />
              </SkeletonTheme>
            ) : (
              <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <StyledFullWidthContainer>
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{
                      type: 'spring',
                      stiffness: 800,
                      damping: 35,
                    }}
                  >
                    <StyledInputContainer>
                      <TextInput
                        autoFocus
                        value={email}
                        placeholder={`Surel`}
                        fullWidth
                        disabled
                      />
                    </StyledInputContainer>
                  </m.div>
                </StyledFullWidthContainer>
                <StyledFullWidthContainer>
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{
                      type: 'spring',
                      stiffness: 800,
                      damping: 35,
                    }}
                  >
                    <Controller
                      name="newPassword"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <StyledInputContainer>
                          <TextInput
                            autoFocus
                            value={value}
                            type="password"
                            placeholder={`Kata Sandi Baru`}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={error?.message}
                            fullWidth
                          />
                        </StyledInputContainer>
                      )}
                    />
                  </m.div>
                </StyledFullWidthContainer>

                <StyledMainButtonContainer>
                  <MainButton
                    variant="secondary"
                    title={passwordActionLabel}
                    type="submit"
                    fullWidth
                    disabled={isUpdatingPassword}
                  />
                </StyledMainButtonContainer>
              </StyledForm>
            )}
          </StyledContentContainer>
        </StyledMainContainer>
      </ModalContent>
    )
  );
};
