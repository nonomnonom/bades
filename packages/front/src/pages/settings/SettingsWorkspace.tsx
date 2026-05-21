import { useLingui } from '@lingui/react/macro';

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
      title={"Umum"}
      links={[
        {
          children: "Ruang kerja",
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: "Umum" },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title title={""Picture"} />
          <WorkspaceLogoUploader />
        </Section>
        <Section>
          <H2Title title={"Nama"} description={""Name of your workspace"} />
          <NameField />
        </Section>
        {isMultiWorkspaceEnabled && (
          <Section>
            <H2Title
              title={""Workspace Domain"}
              description={""Edit your subdomain name or set a custom domain."}
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
