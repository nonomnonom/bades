import { styled } from '@linaria/react';
import { useLingui } from '~/utils/i18n/badesI18n';
import { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';

import { Select } from '@/ui/input/components/Select';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';

import { SettingsAccountsPasswordController } from '@/settings/accounts/components/SettingsAccountsPasswordController';
import { type ConnectionFormData } from '@/settings/accounts/hooks/useImapSmtpCaldavConnectionForm';
import { type AccountType } from 'shared/constants';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { MOBILE_VIEWPORT, themeCssVariables } from 'ui/theme-constants';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
`;

const StyledConnectionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledSectionHeader = styled.div`
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledSectionTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  margin: 0;
  margin-bottom: ${themeCssVariables.spacing[1]};
`;

const StyledSectionDescription = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

const StyledFieldRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[3]};

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    flex-direction: column;
  }
`;

const StyledFieldGroup = styled.div`
  flex: 1;

  & > * {
    width: 100%;
  }
`;

type SettingsAccountsConnectionFormProps = {
  control: Control<ConnectionFormData>;
  isEditing: boolean;
  existingProtocols?: AccountType[];
};

export const SettingsAccountsConnectionForm = ({
  control,
  isEditing,
  existingProtocols = [],
}: SettingsAccountsConnectionFormProps) => {
  const { t } = useLingui();

  const [isProtocolPasswordBeingEdited, setIsProtocolPasswordBeingEdited] =
    useState<Record<AccountType, boolean>>({
      IMAP: false,
      SMTP: false,
      CALDAV: false,
    });

  const isPasswordInputDisabled = (protocol: AccountType) =>
    existingProtocols.includes(protocol) &&
    !isProtocolPasswordBeingEdited[protocol];

  const getDescription = () => {
    if (isEditing) {
      return t`Perbarui konfigurasi akun Anda. Atur kombinasi IMAP, SMTP, dan CalDAV sesuai kebutuhan.`;
    }
    return t`Anda dapat mengatur kombinasi IMAP (menerima email), SMTP (mengirim email), dan CalDAV (sinkronisasi kalender).`;
  };

  const handlePortChange = (value: string) => Number(value);

  return (
    <Section>
      <H2Title title={t`Akun Email`} description={getDescription()} />
      <StyledFormContainer>
        <Controller
          name="handle"
          control={control}
          render={({ field, fieldState }) => (
            <SettingsTextInput
              instanceId="email-address-connection-form"
              label={t`Alamat Email`}
              placeholder={t`john.doe@example.com`}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <StyledConnectionSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t`Konfigurasi IMAP`}</StyledSectionTitle>
            <StyledSectionDescription>
              {t`Atur pengaturan IMAP untuk menerima dan menyinkronkan email Anda.`}{' '}
              {t`Biarkan kosong jika tidak perlu mengimpor email.`}
            </StyledSectionDescription>
          </StyledSectionHeader>

          <Controller
            name="IMAP.host"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="imap-host-connection-form"
                label={t`Server IMAP`}
                placeholder={t`imap.example.com`}
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="IMAP.username"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="imap-username-connection-form"
                label={t`Nama Pengguna IMAP (Opsional)`}
                placeholder={t`john.doe`}
                type="text"
                value={field.value || ''}
                required={false}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <SettingsAccountsPasswordController
            protocol="IMAP"
            label={t`Kata Sandi IMAP`}
            control={control}
            disabled={isPasswordInputDisabled('IMAP')}
            onUnlock={() =>
              setIsProtocolPasswordBeingEdited((prev) => ({
                ...prev,
                IMAP: true,
              }))
            }
          />

          <StyledFieldRow>
            <StyledFieldGroup>
              <Controller
                name="IMAP.port"
                control={control}
                render={({ field, fieldState }) => (
                  <SettingsTextInput
                    instanceId="imap-port-connection-form"
                    label={t`Port IMAP`}
                    type="number"
                    placeholder="993"
                    value={field?.value ? field.value : 993}
                    onChange={(value) =>
                      field.onChange(handlePortChange(value))
                    }
                    error={fieldState.error?.message}
                  />
                )}
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Controller
                name="IMAP.secure"
                control={control}
                render={({ field }) => (
                  <Select
                    label={t`Enkripsi IMAP`}
                    options={[
                      { label: 'SSL/TLS', value: true },
                      { label: 'None', value: false },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    dropdownId="imap-secure-dropdown"
                  />
                )}
              />
            </StyledFieldGroup>
          </StyledFieldRow>
        </StyledConnectionSection>

        <StyledConnectionSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t`Konfigurasi SMTP`}</StyledSectionTitle>
            <StyledSectionDescription>
              {t`Atur pengaturan SMTP untuk mengirim email dari akun Anda.`}{' '}
              {t`Biarkan kosong jika tidak perlu mengirim email.`}
            </StyledSectionDescription>
          </StyledSectionHeader>

          <Controller
            name="SMTP.host"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="smtp-host-connection-form"
                label={t`Server SMTP`}
                placeholder={t`smtp.example.com`}
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="SMTP.username"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="smtp-username-connection-form"
                label={t`Nama Pengguna SMTP`}
                placeholder={t`john.doe`}
                type="text"
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <SettingsAccountsPasswordController
            protocol="SMTP"
            label={t`Kata Sandi SMTP`}
            control={control}
            disabled={isPasswordInputDisabled('SMTP')}
            onUnlock={() =>
              setIsProtocolPasswordBeingEdited((prev) => ({
                ...prev,
                SMTP: true,
              }))
            }
          />

          <StyledFieldRow>
            <StyledFieldGroup>
              <Controller
                name="SMTP.port"
                control={control}
                render={({ field, fieldState }) => (
                  <SettingsTextInput
                    instanceId="smtp-port-connection-form"
                    label={t`Port SMTP`}
                    type="number"
                    placeholder="587"
                    value={field?.value ? field.value : 587}
                    onChange={(value) =>
                      field.onChange(handlePortChange(value))
                    }
                    error={fieldState.error?.message}
                  />
                )}
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Controller
                name="SMTP.secure"
                control={control}
                render={({ field }) => (
                  <Select
                    label={t`Enkripsi SMTP`}
                    options={[
                      { label: 'SSL/TLS', value: true },
                      { label: 'STARTTLS', value: false },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    dropdownId="smtp-secure-dropdown"
                  />
                )}
              />
            </StyledFieldGroup>
          </StyledFieldRow>
        </StyledConnectionSection>

        <StyledConnectionSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t`Konfigurasi CalDAV`}</StyledSectionTitle>
            <StyledSectionDescription>
              {t`Atur pengaturan CalDAV untuk menyinkronkan acara kalender Anda.`}{' '}
              {t`Biarkan kosong jika tidak perlu sinkronisasi kalender.`}
            </StyledSectionDescription>
          </StyledSectionHeader>

          <Controller
            name="CALDAV.host"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="caldav-host-connection-form"
                label={t`Server CalDAV`}
                placeholder={t`caldav.example.com`}
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="CALDAV.username"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="caldav-username-connection-form"
                label={t`Nama Pengguna CalDAV`}
                placeholder={t`john.doe`}
                required={false}
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <SettingsAccountsPasswordController
            protocol="CALDAV"
            label={t`Kata Sandi CalDAV`}
            control={control}
            disabled={isPasswordInputDisabled('CALDAV')}
            onUnlock={() =>
              setIsProtocolPasswordBeingEdited((prev) => ({
                ...prev,
                CALDAV: true,
              }))
            }
          />
        </StyledConnectionSection>
      </StyledFormContainer>
    </Section>
  );
};
