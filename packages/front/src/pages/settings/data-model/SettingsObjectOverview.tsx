import { t } from '~/utils/i18n/badesI18n';
import { ReactFlowProvider } from '@xyflow/react';

import { SettingsDataModelOverview } from '@/settings/data-model/graph-overview/components/SettingsDataModelOverview';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

export const SettingsObjectOverview = () => {
  return (
    <SubMenuTopBarContainer
      links={[
        {
          children: t`Ruang Kerja`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`Objek`, href: getSettingsPath(SettingsPath.Objects) },
        {
          children: t`Ikhtisar`,
        },
      ]}
    >
      <ReactFlowProvider>
        <SettingsDataModelOverview />
      </ReactFlowProvider>
    </SubMenuTopBarContainer>
  );
};
