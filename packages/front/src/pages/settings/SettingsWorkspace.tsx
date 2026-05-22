
import { useLingui } from '~/utils/i18n/badesI18n';
import { isEmailGroupEnabledState } from '@/client-config/states/isEmailGroupEnabledState';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsWorkspaceDomainCard } from '@/settings/domains/components/SettingsWorkspaceDomainCard';
import { DeleteWorkspace } from '@/settings/profile/components/DeleteWorkspace';
import { SettingsWorkspaceEmailGroupSection } from '@/settings/workspace/components/SettingsWorkspaceEmailGroupSection';
import { NameField } from '@/settings/workspace/components/NameField';
import { WorkspaceLogoUploader } from '@/settings/workspace/components/WorkspaceLogoUploader';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey, SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';

export const SettingsWorkspace = () => {
  const { t } = useLingui();

  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );

  const isEmailGroupEnabled = useAtomStateValue(isEmailGroupEnabledState);
  const isEmailGroupFeatureEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_EMAIL_GROUP_ENABLED,
  );
  const showEmailGroupSection =
    isEmailGroupEnabled && isEmailGroupFeatureEnabled;

  return (
    <SubMenuTopBarContainer
      title={t`Pengaturan Umum`}
      links={[
        {
          children: t`Ruang Kerja`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`Pengaturan Umum` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title title={t`Logo`} />
          <WorkspaceLogoUploader />
        </Section>
        <Section>
          <H2Title title={t`Nama`} description={t`Nama ruang kerja Anda`} />
          <NameField />
        </Section>
        {isMultiWorkspaceEnabled && (
          <Section>
            <H2Title
              title={t`Domain Ruang Kerja`}
              description={t`Ubah nama subdomain atau tetapkan domain kustom.`}
            />
            <SettingsWorkspaceDomainCard />
          </Section>
        )}
        {showEmailGroupSection && <SettingsWorkspaceEmailGroupSection />}
        <Section>
          <DeleteWorkspace />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
