import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import {
  SUBDOMAIN_CHANGE_CONFIRMATION_MODAL_ID,
  useSettingsSubdomain,
} from '@/settings/domains/hooks/useSettingsSubdomain';
import { TextInput } from '@/ui/input/components/TextInput';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { styled } from '@linaria/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

const StyledDomainFormWrapper = styled.div`
  align-items: center;
  display: flex;
`;

export const SettingsSubdomain = () => {
  const navigate = useNavigateSettings();
  const { t } = useLingui();
  const domainConfiguration = useAtomStateValue(domainConfigurationState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const {
    subdomain,
    error,
    isSubmitting,
    isSaveDisabled,
    handleChange,
    handleSave,
    handleConfirm,
  } = useSettingsSubdomain();

  return (
    <>
      <SubMenuTopBarContainer
        title={"Subdomain"}
        links={[
          {
            children: <Trans>Ruang Kerja</Trans>,
            href: getSettingsPath(SettingsPath.Workspace),
          },
          {
            children: <Trans>Umum</Trans>,
            href: getSettingsPath(SettingsPath.Workspace),
          },
          { children: "Subdomain" },
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
              title={t`Subdomain`}
              description={t`Atur nama subdomain Anda`}
            />
            <StyledDomainFormWrapper>
              <TextInput
                value={subdomain}
                type="text"
                onChange={handleChange}
                error={error}
                disabled={!!currentWorkspace?.customDomain}
                rightAdornment={
                  isDefined(domainConfiguration.frontDomain)
                    ? `.${domainConfiguration.frontDomain}`
                    : undefined
                }
                fullWidth
              />
            </StyledDomainFormWrapper>
          </Section>
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
      <ConfirmationModal
        modalInstanceId={SUBDOMAIN_CHANGE_CONFIRMATION_MODAL_ID}
        title={t`Ubah subdomain?`}
        subtitle={t`Anda akan mengubah subdomain ruang kerja. Tindakan ini akan mengeluarkan semua pengguna.`}
        onConfirmClick={handleConfirm}
      />
    </>
  );
};
