import { t } from '~/utils/i18n/badesI18n';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePersistLogicFunction } from '@/logic-functions/hooks/usePersistLogicFunction';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';

import {
  IconChartBar,
  IconPlus,
  IconSettingsBolt,
  IconSparkles,
  IconTool,
} from 'ui/display';
import { Button } from 'ui/input';
import { UndecoratedLink } from 'ui/navigation';
import { SettingsAiMoreTab } from '~/pages/settings/ai/components/SettingsAiMoreTab';
import { SettingsAgentToolsTab } from '~/pages/settings/ai/components/SettingsAgentToolsTab';
import { SettingsAiUsageTab } from './components/SettingsAiUsageTab';
import { SettingsAgentSkills } from './components/SettingsAgentSkills';
import { SETTINGS_AI_TABS } from './constants/SettingsAiTabs';

export const SettingsAI = () => {
  const navigate = useNavigate();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { createLogicFunction } = usePersistLogicFunction();
  const [isCreatingTool, setIsCreatingTool] = useState(false);

  const activeTabId = useAtomComponentStateValue(
    activeTabIdComponentState,
    SETTINGS_AI_TABS.COMPONENT_INSTANCE_ID,
  );

  const handleCreateTool = async () => {
    setIsCreatingTool(true);
    try {
      const result = await createLogicFunction({
        input: {
          name: 'new-tool',
          toolTriggerSettings: {
            inputSchema: { type: 'object', properties: {} },
          },
        },
      });

      if (result.status === 'successful' && isDefined(result.response?.data)) {
        const newLogicFunction = result.response.data.createOneLogicFunction;
        enqueueSuccessSnackBar({ message: t`Alat berhasil dibuat` });

        const applicationId = (newLogicFunction as { applicationId?: string })
          .applicationId;
        if (isDefined(applicationId)) {
          navigate(
            getSettingsPath(SettingsPath.ApplicationLogicFunctionDetail, {
              applicationId,
              logicFunctionId: newLogicFunction.id,
            }),
          );
        } else {
          navigate(
            getSettingsPath(SettingsPath.LogicFunctionDetail, {
              logicFunctionId: newLogicFunction.id,
            }),
          );
        }
      } else {
        enqueueErrorSnackBar({ message: t`Gagal membuat alat` });
      }
    } finally {
      setIsCreatingTool(false);
    }
  };

  const tabs = [
    {
      id: SETTINGS_AI_TABS.TABS_IDS.SKILLS,
      title: t`Keahlian`,
      Icon: IconSparkles,
    },
    {
      id: SETTINGS_AI_TABS.TABS_IDS.TOOLS,
      title: t`Alat`,
      Icon: IconTool,
    },
    {
      id: SETTINGS_AI_TABS.TABS_IDS.USAGE,
      title: t`Pemakaian`,
      Icon: IconChartBar,
    },
    {
      id: SETTINGS_AI_TABS.TABS_IDS.MORE,
      title: t`Lainnya`,
      Icon: IconSettingsBolt,
    },
  ];

  const isSkillsTab = activeTabId === SETTINGS_AI_TABS.TABS_IDS.SKILLS;
  const isToolsTab = activeTabId === SETTINGS_AI_TABS.TABS_IDS.TOOLS;
  const isUsageTab = activeTabId === SETTINGS_AI_TABS.TABS_IDS.USAGE;
  const isMoreTab = activeTabId === SETTINGS_AI_TABS.TABS_IDS.MORE;

  return (
    <SubMenuTopBarContainer
      title={""AI"}
      actionButton={
        isSkillsTab ? (
          <UndecoratedLink to={getSettingsPath(SettingsPath.AiNewSkill)}>
            <Button
              Icon={IconPlus}
              title={t`Keahlian Baru`}
              accent="blue"
              size="small"
            />
          </UndecoratedLink>
        ) : isToolsTab ? (
          <Button
            Icon={IconPlus}
            title={t`Alat Baru`}
            accent="blue"
            size="small"
            onClick={handleCreateTool}
            disabled={isCreatingTool}
          />
        ) : undefined
      }
      links={[
        {
          children: t`Ruang Kerja`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: ""AI" },
      ]}
    >
      <SettingsPageContainer>
        <TabList
          tabs={tabs}
          componentInstanceId={SETTINGS_AI_TABS.COMPONENT_INSTANCE_ID}
        />
        {isSkillsTab && <SettingsAgentSkills />}
        {isToolsTab && <SettingsAgentToolsTab />}
        {isUsageTab && <SettingsAiUsageTab />}
        {isMoreTab && <SettingsAiMoreTab />}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
