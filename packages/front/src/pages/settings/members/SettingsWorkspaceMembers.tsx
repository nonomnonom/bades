import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { IconLock, IconUserPlus, IconUsers } from 'ui/display';

import { useHasPermissionFlag } from '@/settings/roles/hooks/useHasPermissionFlag';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { PermissionFlagType } from '~/generated-metadata/graphql';
import { SettingsWorkspaceMembersInviteTab } from '~/pages/settings/members/tabs/SettingsWorkspaceMembersInviteTab';
import { SettingsWorkspaceMembersRolesTab } from '~/pages/settings/members/tabs/SettingsWorkspaceMembersRolesTab';
import { SettingsWorkspaceMembersTeamTab } from '~/pages/settings/members/tabs/SettingsWorkspaceMembersTeamTab';

const MEMBERS_TAB_LIST_ID = 'members-tab-list';

const MEMBERS_TAB_TEAM_ID = 'team';
const MEMBERS_TAB_INVITE_ID = 'invite';
const MEMBERS_TAB_ROLES_ID = 'roles';

export const SettingsWorkspaceMembers = () => {
  const { t } = useLingui();

  const hasRolesPermission = useHasPermissionFlag(PermissionFlagType.ROLES);

  const activeTabId = useAtomComponentStateValue(
    activeTabIdComponentState,
    MEMBERS_TAB_LIST_ID,
  );

  const tabs = [
    { id: MEMBERS_TAB_TEAM_ID, title: "Tim", Icon: IconUsers },
    { id: MEMBERS_TAB_INVITE_ID, title: "Undang", Icon: IconUserPlus },
    ...(hasRolesPermission
      ? [{ id: MEMBERS_TAB_ROLES_ID, title: "Peran-peran", Icon: IconLock }]
      : []),
  ];

  const renderActiveTabContent = () => {
    switch (activeTabId) {
      case MEMBERS_TAB_INVITE_ID:
        return <SettingsWorkspaceMembersInviteTab />;
      case MEMBERS_TAB_ROLES_ID:
        return hasRolesPermission ? (
          <SettingsWorkspaceMembersRolesTab />
        ) : (
          <SettingsWorkspaceMembersTeamTab />
        );
      default:
        return <SettingsWorkspaceMembersTeamTab />;
    }
  };

  return (
    <SubMenuTopBarContainer
      title={"Anggota"}
      links={[
        {
          children: Ruang kerja,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: Anggota },
      ]}
    >
      <SettingsPageContainer>
        <TabList tabs={tabs} componentInstanceId={MEMBERS_TAB_LIST_ID} />
        {renderActiveTabContent()}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
