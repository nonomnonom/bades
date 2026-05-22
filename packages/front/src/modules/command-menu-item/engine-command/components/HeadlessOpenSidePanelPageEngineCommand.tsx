import { HeadlessEngineCommandWrapperEffect } from '@/command-menu-item/engine-command/components/HeadlessEngineCommandWrapperEffect';
import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { sidePanelSearchState } from '@/side-panel/states/sidePanelSearchState';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { t } from '~/utils/i18n/badesI18n';
import { type SidePanelPages } from 'shared/types';
import { type IconComponent } from 'ui/display';

export const HeadlessOpenSidePanelPageEngineCommand = ({
  page,
  pageTitle,
  pageIcon,
  shouldResetSearchState = false,
}: {
  page: SidePanelPages;
  pageTitle: string;
  pageIcon: IconComponent;
  shouldResetSearchState?: boolean;
}) => {
  const { navigateSidePanel } = useNavigateSidePanel();
  const setSidePanelSearch = useSetAtomState(sidePanelSearchState);

  const onExecute = () => {
    navigateSidePanel({
      page,
      pageTitle: t(pageTitle),
      pageIcon,
    });

    if (shouldResetSearchState) {
      setSidePanelSearch('');
    }
  };

  return <HeadlessEngineCommandWrapperEffect execute={onExecute} />;
};
