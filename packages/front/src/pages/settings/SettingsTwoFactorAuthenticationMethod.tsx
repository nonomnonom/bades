import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { styled } from '@linaria/react';
import { FormProvider } from 'react-hook-form';
import QRCode from 'react-qr-code';

import { qrCodeState } from '@/auth/states/qrCode';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { DeleteTwoFactorAuthentication } from '@/settings/two-factor-authentication/components/DeleteTwoFactorAuthenticationMethod';
import { TwoFactorAuthenticationSetupForSettingsEffect } from '@/settings/two-factor-authentication/components/TwoFactorAuthenticationSetupForSettingsEffect';
import { TwoFactorAuthenticationVerificationForSettings } from '@/settings/two-factor-authentication/components/TwoFactorAuthenticationVerificationForSettings';
import { useCurrentUserWorkspaceTwoFactorAuthentication } from '@/settings/two-factor-authentication/hooks/useCurrentUserWorkspaceTwoFactorAuthentication';
import { useTwoFactorVerificationForSettings } from '@/settings/two-factor-authentication/hooks/useTwoFactorVerificationForSettings';
import { extractSecretFromOtpUri } from '@/settings/two-factor-authentication/utils/extractSecretFromOtpUri';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Loader } from 'ui/feedback';
import { Section } from 'ui/layout';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { themeCssVariables } from 'ui/theme-constants';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

const StyledQRCodeContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  margin: ${themeCssVariables.spacing[4]} 0;
`;

const StyledQRCodeWrapper = styled.div`
  align-items: center;
  background-color: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  justify-content: center;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledOTPContainer = styled.div`
  width: fit-content;
`;

const StyledQRCodeSizer = styled.div`
  height: 137px;
  width: 137px;

  & > svg {
    height: 100%;
    width: 100%;
  }
`;

const StyledCopySetupKeyText = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
  text-align: left;
`;

const StyledCopySetupKeyLink = styled.button`
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: inline;
  font-size: ${themeCssVariables.font.size.sm};
  margin-left: 0;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: ${themeCssVariables.font.color.secondary};
  }
`;

const StyledDivider = styled.div`
  margin: ${themeCssVariables.spacing[6]} 0;
  width: 100%;
`;

export const SettingsTwoFactorAuthenticationMethod = () => {
  const { t } = useLingui();
  const { copyToClipboard } = useCopyToClipboard();
  const qrCode = useAtomStateValue(qrCodeState);

  const { currentUserWorkspaceTwoFactorAuthenticationMethods } =
    useCurrentUserWorkspaceTwoFactorAuthentication();

  const has2FAMethod =
    currentUserWorkspaceTwoFactorAuthenticationMethods['TOTP']?.status ===
    'VERIFIED';

  const verificationForm = useTwoFactorVerificationForSettings();

  const shouldShowActionButtons = !has2FAMethod;

  const handleCopySetupKey = async () => {
    if (!qrCode) return;

    const secret = extractSecretFromOtpUri(qrCode);
    if (secret !== null) {
      await copyToClipboard(secret, t`Kunci penyiapan tersalin ke papan klip`);
    }
  };

  return (
    // oxlint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...verificationForm.formConfig}>
      <SubMenuTopBarContainer
        title={t`Autentikasi Dua Faktor`}
        links={[
          {
            children: <Trans>Pengguna</Trans>,
            href: getSettingsPath(SettingsPath.ProfilePage),
          },
          {
            children: <Trans>Profil</Trans>,
            href: getSettingsPath(SettingsPath.ProfilePage),
          },
          {
            children: <Trans>Autentikasi Dua Faktor</Trans>,
          },
        ]}
        actionButton={
          shouldShowActionButtons ? (
            <SaveAndCancelButtons
              isSaveDisabled={!verificationForm.canSave}
              isCancelDisabled={verificationForm.isSubmitting}
              isLoading={verificationForm.isLoading}
              onCancel={verificationForm.handleCancel}
              onSave={verificationForm.formConfig.handleSubmit(
                verificationForm.handleSave,
              )}
            />
          ) : undefined
        }
      >
        <SettingsPageContainer>
          {has2FAMethod ? (
            <Section>
              <DeleteTwoFactorAuthentication />
            </Section>
          ) : (
            <Section>
              <TwoFactorAuthenticationSetupForSettingsEffect />
              <H2Title
                title={t`Aplikasi autentikator`}
                description={t`Aplikasi autentikator dan ekstensi browser seperti 1Password, Authy, Microsoft Authenticator, dll. membuat kata sandi sekali pakai sebagai faktor kedua untuk memverifikasi identitas Anda saat masuk.`}
              />
              <StyledQRCodeContainer>
                {!qrCode ? (
                  <Loader />
                ) : (
                  <>
                    <StyledQRCodeWrapper>
                      <StyledQRCodeSizer>
                        <QRCode value={qrCode} />
                      </StyledQRCodeSizer>
                    </StyledQRCodeWrapper>
                    <StyledCopySetupKeyText>
                      <Trans>Tidak bisa pindai? Salin</Trans>{' '}
                      <StyledCopySetupKeyLink onClick={handleCopySetupKey}>
                        <Trans>kunci penyiapan</Trans>
                      </StyledCopySetupKeyLink>
                    </StyledCopySetupKeyText>
                  </>
                )}
              </StyledQRCodeContainer>

              <StyledDivider />

              <H2Title
                title={t`Verifikasi kode dari aplikasi`}
                description={t`Salin dan tempelkan kode di bawah ini`}
              />
              <StyledOTPContainer>
                <TwoFactorAuthenticationVerificationForSettings />
              </StyledOTPContainer>
            </Section>
          )}
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    </FormProvider>
  );
};
