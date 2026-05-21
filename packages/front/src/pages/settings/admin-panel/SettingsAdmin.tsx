import { SettingsAdminContent } from '@/settings/admin-panel/components/SettingsAdminContent';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

export const SettingsAdmin = () => {
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={""Admin Panel"}
      links={[
        {
          children: "Lainnya",
          href: getSettingsPath(SettingsPath.AdminPanel),
        },
        { children: ""Admin Panel" },
      ]}
    >
      <SettingsPageContainer>
        <SettingsAdminContent />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
