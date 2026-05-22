/* @license Enterprise */

import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { Controller, useFormContext } from 'react-hook-form';
import { H2Title, IconCopy } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

const StyledInputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledLinkContainer = styled.div`
  flex: 1;
  margin-right: ${themeCssVariables.spacing[2]};
`;

const StyledButtonCopy = styled.div`
  align-items: end;
  display: flex;
  margin-bottom: ${themeCssVariables.spacing[1]};
`;

export const SettingsSSOOIDCForm = () => {
  const { control } = useFormContext();
  const { copyToClipboard } = useCopyToClipboard();
  const { t } = useLingui();

  const authorizedUrl = window.location.origin;
  const redirectionUrl = `${REACT_APP_SERVER_BASE_URL}/auth/oidc/callback`;

  return (
    <>
      <Section>
        <H2Title
          title={t`Pengaturan Klien`}
          description={t`Masukkan detail penyedia OIDC Anda`}
        />
        <StyledInputsContainer>
          <StyledContainer>
            <StyledLinkContainer>
              <SettingsTextInput
                instanceId="sso-oidc-authorized-uri"
                readOnly={true}
                label={t`URI Terotorisasi`}
                value={authorizedUrl}
                fullWidth
              />
            </StyledLinkContainer>
            <StyledButtonCopy>
              <Button
                Icon={IconCopy}
                title={t`Salin`}
                onClick={() => {
                  copyToClipboard(
                    authorizedUrl,
                    t`URL terotorisasi disalin ke papan klip`,
                  );
                }}
                type="button"
              />
            </StyledButtonCopy>
          </StyledContainer>
          <StyledContainer>
            <StyledLinkContainer>
              <SettingsTextInput
                instanceId="sso-oidc-redirection-uri"
                readOnly={true}
                label={t`URI Pengalihan`}
                value={redirectionUrl}
                fullWidth
              />
            </StyledLinkContainer>
            <StyledButtonCopy>
              <Button
                Icon={IconCopy}
                title={t`Salin`}
                onClick={() => {
                  copyToClipboard(
                    redirectionUrl,
                    t`URL pengalihan disalin ke papan klip`,
                  );
                }}
                type="button"
              />
            </StyledButtonCopy>
          </StyledContainer>
        </StyledInputsContainer>
      </Section>
      <Section>
        <H2Title
          title={t`Penyedia Identitas`}
          description={t`Masukkan kredensial untuk menyiapkan koneksi`}
        />
        <StyledInputsContainer>
          <Controller
            name="clientID"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SettingsTextInput
                instanceId="sso-oidc-client-id"
                autoComplete="off"
                label={t`ID Klien`}
                value={value}
                onChange={onChange}
                fullWidth
                placeholder="900960562328-36306ohbk8e3.apps.googleusercontent.com"
              />
            )}
          />
          <Controller
            name="clientSecret"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SettingsTextInput
                instanceId="sso-oidc-client-secret"
                autoComplete="off"
                type="password"
                label={t`Rahasia Klien`}
                value={value}
                onChange={onChange}
                fullWidth
                placeholder="****************************"
              />
            )}
          />
          <Controller
            name="issuer"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SettingsTextInput
                instanceId="sso-oidc-issuer"
                autoComplete="off"
                label={t`URI Penerbit`}
                value={value}
                onChange={onChange}
                fullWidth
                placeholder="https://accounts.google.com"
              />
            )}
          />
        </StyledInputsContainer>
      </Section>
    </>
  );
};
