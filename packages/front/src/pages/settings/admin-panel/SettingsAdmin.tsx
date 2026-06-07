import { SettingsAdminContent } from '@/settings/admin-panel/components/SettingsAdminContent';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

export const SettingsAdmin = () => {
  return (
    <SubMenuTopBarContainer
      title={`Panel Admin`}
      links={[
        {
          children: `Lainnya`,
          href: getSettingsPath(SettingsPath.AdminPanel),
        },
        { children: `Panel Admin` },
      ]}
    >
      <SettingsPageContainer>
        <SettingsAdminContent />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
