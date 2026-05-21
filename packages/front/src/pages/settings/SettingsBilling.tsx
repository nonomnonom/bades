import { Trans, useLingui } from '@lingui/react/macro';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsBillingContent } from '@/settings/billing/components/SettingsBillingContent';
import { getSettingsPath } from 'shared/utils';
import { SettingsPath } from 'shared/types';
import { usePlans } from '@/settings/billing/hooks/usePlans';

export const SettingsBilling = () => {
  const { t } = useLingui();

  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const { isPlansLoaded } = usePlans();

  return (
    <SubMenuTopBarContainer
      title={"Penagihan"}
      links={[
        {
          children: Ruang kerja,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: Penagihan },
      ]}
    >
      {currentWorkspace && isPlansLoaded ? <SettingsBillingContent /> : <></>}
    </SubMenuTopBarContainer>
  );
};
