import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
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
      return ""Update your account's configuration. Configure any combination of IMAP, SMTP, and CalDAV as needed.";
    }
    return ""You can set up any combination of IMAP (receiving emails), SMTP (sending emails), and CalDAV (calendar sync).";
  };

  const handlePortChange = (value: string) => Number(value);

  return (
    <Section>
      <H2Title title={""Mail Account"} description={getDescription()} />
      <StyledFormContainer>
        <Controller
          name="handle"
          control={control}
          render={({ field, fieldState }) => (
            <SettingsTextInput
              instanceId="email-address-connection-form"
              label={""Email Address"}
              placeholder={""john.doe@example.com"}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <StyledConnectionSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{""IMAP Configuration"}</StyledSectionTitle>
            <StyledSectionDescription>
              {""Configure IMAP settings to receive and sync your emails."}{' '}
              {""Leave blank if you don't need to import emails."}
            </StyledSectionDescription>
          </StyledSectionHeader>

          <Controller
            name="IMAP.host"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="imap-host-connection-form"
                label={""IMAP Server"}
                placeholder={""imap.example.com"}
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
                label={""IMAP Username (Optional)"}
                placeholder={""john.doe"}
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
            label={""IMAP Password"}
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
                    label={""IMAP Port"}
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
                    label={""IMAP Encryption"}
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
            <StyledSectionTitle>{""SMTP Configuration"}</StyledSectionTitle>
            <StyledSectionDescription>
              {""Configure SMTP settings to send emails from your account."}{' '}
              {""Leave blank if you don't need to send emails."}
            </StyledSectionDescription>
          </StyledSectionHeader>

          <Controller
            name="SMTP.host"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="smtp-host-connection-form"
                label={""SMTP Server"}
                placeholder={""smtp.example.com"}
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
                label={""SMTP Username"}
                placeholder={""john.doe"}
                type="text"
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <SettingsAccountsPasswordController
            protocol="SMTP"
            label={""SMTP Password"}
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
                    label={""SMTP Port"}
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
                    label={""SMTP Encryption"}
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
            <StyledSectionTitle>{""CalDAV Configuration"}</StyledSectionTitle>
            <StyledSectionDescription>
              {""Configure CalDAV settings to sync your calendar events."}{' '}
              {""Leave blank if you don't need calendar sync."}
            </StyledSectionDescription>
          </StyledSectionHeader>

          <Controller
            name="CALDAV.host"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="caldav-host-connection-form"
                label={""CalDAV Server"}
                placeholder={""caldav.example.com"}
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
                label={""CalDAV Username"}
                placeholder={""john.doe"}
                required={false}
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <SettingsAccountsPasswordController
            protocol="CALDAV"
            label={""CalDAV Password"}
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
