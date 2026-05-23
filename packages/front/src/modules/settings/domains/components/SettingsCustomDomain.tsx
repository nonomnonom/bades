/* @license Enterprise */
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { CheckCustomDomainValidRecordsEffect } from '@/settings/domains/components/CheckCustomDomainValidRecordsEffect';
import { SettingsDomainRecords } from '@/settings/domains/components/SettingsDomainRecords';
import { useSettingsCustomDomain } from '@/settings/domains/hooks/useSettingsCustomDomain';
import { customDomainRecordsState } from '@/settings/domains/states/customDomainRecordsState';
import { TextInput } from '@/ui/input/components/TextInput';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { styled } from '@linaria/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconReload, IconTrash } from 'ui/display';
import { Button, ButtonGroup } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { useCheckCustomDomainValidRecords } from '@/settings/domains/hooks/useCheckCustomDomainValidRecords';

const StyledDomainFormWrapper = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledButtonGroupContainer = styled.div`
  > * > :not(:first-of-type) > button {
    border-left: none;
  }
`;

const StyledButtonContainer = styled.div`
  align-self: flex-start;
`;

const StyledRecordsWrapper = styled.div`
  margin-top: ${themeCssVariables.spacing[2]};

  & > :not(:first-of-type) {
    margin-top: ${themeCssVariables.spacing[4]};
  }
`;

export const SettingsCustomDomain = () => {
  const navigate = useNavigateSettings();
  const { t } = useLingui();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const { customDomainRecords, isLoading: isRecordsLoading } =
    useAtomStateValue(customDomainRecordsState);
  const { checkCustomDomainRecords } = useCheckCustomDomainValidRecords();

  const {
    customDomain,
    error,
    isSubmitting,
    isSaveDisabled,
    handleChange,
    handleDelete,
    handleSave,
  } = useSettingsCustomDomain();

  return (
    <SubMenuTopBarContainer
      title={t`Domain Kustom`}
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: <Trans>Umum</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: <Trans>Domain Kustom</Trans> },
      ]}
      actionButton={
        <SaveAndCancelButtons
          onCancel={() => navigate(SettingsPath.Workspace)}
          isSaveDisabled={isSaveDisabled}
          isLoading={isSubmitting}
          onSave={handleSave}
        />
      }
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Domain Kustom`}
            description={t`Atur nama domain kustom Anda dan konfigurasikan rekaman DNS.`}
          />
          <CheckCustomDomainValidRecordsEffect />
          <StyledDomainFormWrapper>
            <TextInput
              value={customDomain}
              type="text"
              onChange={handleChange}
              placeholder="crm.yourdomain.com"
              error={error}
              fullWidth
            />
            {currentWorkspace?.customDomain && (
              <StyledButtonGroupContainer>
                <ButtonGroup>
                  <StyledButtonContainer>
                    <Button
                      isLoading={isRecordsLoading}
                      Icon={IconReload}
                      title={t`Muat ulang`}
                      variant="primary"
                      onClick={checkCustomDomainRecords}
                      type="button"
                    />
                  </StyledButtonContainer>
                  <StyledButtonContainer>
                    <Button
                      Icon={IconTrash}
                      variant="primary"
                      onClick={handleDelete}
                    />
                  </StyledButtonContainer>
                </ButtonGroup>
              </StyledButtonGroupContainer>
            )}
          </StyledDomainFormWrapper>
          {currentWorkspace?.customDomain && (
            <StyledRecordsWrapper>
              {customDomainRecords && (
                <SettingsDomainRecords records={customDomainRecords.records} />
              )}
            </StyledRecordsWrapper>
          )}
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
