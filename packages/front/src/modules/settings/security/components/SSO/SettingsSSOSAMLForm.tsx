/* @license Enterprise */

import { parseSAMLMetadataFromXMLFile } from '@/settings/security/utils/parseSAMLMetadataFromXMLFile';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { type ChangeEvent, useContext, useRef } from 'react';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useFormContext } from 'react-hook-form';
import { isDefined } from 'shared/utils';
import {
  H2Title,
  HorizontalSeparator,
  IconCheck,
  IconCopy,
  IconDownload,
  IconUpload,
} from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

const StyledUploadFileContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledFileInput = styled.input`
  display: none;
`;

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

export const SettingsSSOSAMLForm = () => {
  const { theme } = useContext(ThemeContext);
  const { enqueueErrorSnackBar } = useSnackBar();
  const { setValue, getValues, watch, trigger } = useFormContext();
  const { t } = useLingui();
  const { copyToClipboard } = useCopyToClipboard();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (isDefined(e.target.files)) {
      const text = await e.target.files[0].text();
      const samlMetadataParsed = parseSAMLMetadataFromXMLFile(text);
      e.target.value = '';
      if (!samlMetadataParsed.success) {
        return enqueueErrorSnackBar({
          message: t`Berkas tidak valid`,
          options: {
            duration: 2000,
          },
        });
      }
      setValue('ssoURL', samlMetadataParsed.data.ssoUrl);
      setValue('certificate', samlMetadataParsed.data.certificate);
      setValue('issuer', samlMetadataParsed.data.entityID);
      trigger();
    }
  };

  const entityID = `${REACT_APP_SERVER_BASE_URL}/auth/saml/login/${getValues('id')}`;
  const acsUrl = `${REACT_APP_SERVER_BASE_URL}/auth/saml/callback/${getValues('id')}`;

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUploadFileClick = () => {
    inputFileRef?.current?.click?.();
  };

  const ssoURL = watch('ssoURL');
  const certificate = watch('certificate');
  const issuer = watch('issuer');

  const isXMLMetadataValid = () => {
    return [ssoURL, certificate, issuer].every(
      (field) => isDefined(field) && field.length > 0,
    );
  };

  const downloadMetadata = async () => {
    const response = await fetch(
      `${REACT_APP_SERVER_BASE_URL}/auth/saml/metadata/${getValues('id')}`,
    );
    if (!response.ok) {
      return enqueueErrorSnackBar({
        message: t`Gagal membuat berkas metadata`,
        options: {
          duration: 2000,
        },
      });
    }
    const text = await response.text();
    const blob = new Blob([text], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <Section>
        <H2Title
          title={t`Metadata XML Penyedia Identitas`}
          description={t`Unggah berkas XML dengan informasi koneksi Anda`}
        />
        <StyledUploadFileContainer>
          <StyledFileInput
            ref={inputFileRef}
            onChange={handleFileChange}
            type="file"
            accept=".xml"
          />
          <Button
            Icon={IconUpload}
            onClick={handleUploadFileClick}
            title={t`Unggah berkas`}
            type="button"
          ></Button>
          {isXMLMetadataValid() && (
            <IconCheck
              size={theme.icon.size.md}
              stroke={theme.icon.stroke.lg}
              color={theme.color.blue}
            />
          )}
        </StyledUploadFileContainer>
      </Section>
      <Section>
        <H2Title
          title={t`Detail Penyedia Layanan`}
          description={t`Masukkan informasi untuk menyiapkan koneksi`}
        />
        <StyledInputsContainer>
          <StyledContainer>
            <Button
              Icon={IconDownload}
              onClick={downloadMetadata}
              title={t`Unduh berkas`}
              type="button"
            />
          </StyledContainer>
          <HorizontalSeparator text={t`Atau`} />
          <StyledContainer>
            <StyledLinkContainer>
              <SettingsTextInput
                instanceId="sso-saml-acs-url"
                disabled={true}
                label={t`URL ACS`}
                value={acsUrl}
                fullWidth
              />
            </StyledLinkContainer>
            <StyledButtonCopy>
              <Button
                Icon={IconCopy}
                title={t`Salin`}
                onClick={() => {
                  copyToClipboard(acsUrl, t`URL ACS disalin ke papan klip`);
                }}
                type="button"
              />
            </StyledButtonCopy>
          </StyledContainer>
          <StyledContainer>
            <StyledLinkContainer>
              <SettingsTextInput
                instanceId="sso-saml-entity-id"
                disabled={true}
                label={t`ID Entitas`}
                value={entityID}
                fullWidth
              />
            </StyledLinkContainer>
            <StyledButtonCopy>
              <Button
                Icon={IconCopy}
                title={t`Salin`}
                onClick={() => {
                  copyToClipboard(entityID, t`ID Entitas disalin ke papan klip`);
                }}
                type="button"
              />
            </StyledButtonCopy>
          </StyledContainer>
        </StyledInputsContainer>
      </Section>
    </>
  );
};
