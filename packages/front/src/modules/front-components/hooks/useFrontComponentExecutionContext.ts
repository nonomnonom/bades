import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import {
  type FrontComponentExecutionContext,
  type FrontComponentHostCommunicationApi,
} from 'front-component-renderer';
import {
  type AppPath,
  type EnqueueSnackbarParams,
  type NavigateOptions,
  type SidePanelPages,
} from 'shared/types';
import { type CommandConfirmationModalAccent } from 'sdk/front-component';
import { type getAppPath } from 'shared/utils';

import { currentUserState } from '@/auth/states/currentUserState';
import { useCommandMenuConfirmationModal } from '@/command-menu-item/confirmation-modal/hooks/useCommandMenuConfirmationModal';
import { useUnmountCommand } from '@/command-menu-item/engine-command/hooks/useUnmountEngineCommand';
import { commandMenuItemProgressFamilyState } from '@/command-menu-item/states/commandMenuItemProgressFamilyState';
import { useRequestApplicationTokenRefresh } from '@/front-components/hooks/useRequestApplicationTokenRefresh';
import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { useSidePanelMenu } from '@/side-panel/hooks/useSidePanelMenu';
import { sidePanelSearchState } from '@/side-panel/states/sidePanelSearchState';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomFamilyState } from '@/ui/utilities/state/jotai/hooks/useSetAtomFamilyState';
import { assertUnreachable, isDefined } from 'shared/utils';
import { useIcons } from 'ui/display';
import { useNavigateApp } from '~/hooks/useNavigateApp';

export const useFrontComponentExecutionContext = ({
  frontComponentId,
  commandMenuItemId,
  selectedRecordIds,
}: {
  frontComponentId: string;
  commandMenuItemId?: string;
  selectedRecordIds?: string[];
}): {
  executionContext: FrontComponentExecutionContext;
  frontComponentHostCommunicationApi: FrontComponentHostCommunicationApi;
} => {
  const currentUser = useAtomStateValue(currentUserState);
  const navigateApp = useNavigateApp();
  const { requestAccessTokenRefresh } = useRequestApplicationTokenRefresh({
    frontComponentId,
  });
  const { openConfirmationModal } = useCommandMenuConfirmationModal();
  const { navigateSidePanel } = useNavigateSidePanel();
  const setSidePanelSearch = useSetAtomState(sidePanelSearchState);
  const { getIcon } = useIcons();
  const unmountEngineCommand = useUnmountCommand();
  const {
    enqueueSuccessSnackBar,
    enqueueErrorSnackBar,
    enqueueInfoSnackBar,
    enqueueWarningSnackBar,
  } = useSnackBar();
  const { closeSidePanelMenu } = useSidePanelMenu();
  const setCommandMenuItemProgress = useSetAtomFamilyState(
    commandMenuItemProgressFamilyState,
    commandMenuItemId ?? '',
  );

  const navigate: FrontComponentHostCommunicationApi['navigate'] = async <
    T extends AppPath,
  >(
    to: T,
    params?: Parameters<typeof getAppPath<T>>[1],
    queryParams?: Record<string, any>,
    options?: NavigateOptions,
  ) => {
    navigateApp(
      to as AppPath,
      params as Parameters<typeof navigateApp>[1],
      queryParams,
      options,
    );
  };

  const openSidePanelPage: FrontComponentHostCommunicationApi['openSidePanelPage'] =
    async ({
      page,
      pageTitle,
      pageIcon,
      shouldResetSearchState,
    }: {
      page: SidePanelPages;
      pageTitle: string;
      pageIcon?: string;
      shouldResetSearchState?: boolean;
    }) => {
      navigateSidePanel({
        page,
        pageTitle,
        pageIcon: getIcon(pageIcon),
      });

      if (shouldResetSearchState === true) {
        setSidePanelSearch('');
      }
    };

  const openCommandConfirmationModal: FrontComponentHostCommunicationApi['openCommandConfirmationModal'] =
    async ({
      title,
      subtitle,
      confirmButtonText,
      confirmButtonAccent,
    }: {
      title: string;
      subtitle: string;
      confirmButtonText?: string;
      confirmButtonAccent?: CommandConfirmationModalAccent;
    }) => {
      openConfirmationModal({
        caller: { type: 'frontComponent', frontComponentId },
        title,
        subtitle,
        confirmButtonText,
        confirmButtonAccent,
      });
    };

  const enqueueSnackbar: FrontComponentHostCommunicationApi['enqueueSnackbar'] =
    async ({
      message,
      variant,
      duration,
      detailedMessage,
      dedupeKey,
    }: EnqueueSnackbarParams) => {
      const snackBarOptions = {
        duration,
        detailedMessage,
        dedupeKey,
      };

      switch (variant) {
        case 'error':
          enqueueErrorSnackBar({ message, options: snackBarOptions });
          break;
        case 'info':
          enqueueInfoSnackBar({ message, options: snackBarOptions });
          break;
        case 'warning':
          enqueueWarningSnackBar({ message, options: snackBarOptions });
          break;
        case 'success':
          enqueueSuccessSnackBar({ message, options: snackBarOptions });
          break;
        default:
          assertUnreachable(variant);
      }
    };

  const executionContext: FrontComponentExecutionContext = {
    frontComponentId,
    userId: currentUser?.id ?? null,
    recordId: selectedRecordIds?.length === 1 ? selectedRecordIds[0] : null,
    selectedRecordIds: selectedRecordIds ?? [],
  };

  const unmountFrontComponent: FrontComponentHostCommunicationApi['unmountFrontComponent'] =
    async () => {
      if (isDefined(commandMenuItemId)) {
        unmountEngineCommand(commandMenuItemId);
      }
    };

  const closeSidePanel: FrontComponentHostCommunicationApi['closeSidePanel'] =
    async () => {
      closeSidePanelMenu();
    };

  const updateProgress: FrontComponentHostCommunicationApi['updateProgress'] =
    async (progress: number) => {
      if (!isDefined(commandMenuItemId)) {
        return;
      }

      setCommandMenuItemProgress(Math.max(0, Math.min(100, progress)));
    };

  const frontComponentHostCommunicationApi: FrontComponentHostCommunicationApi =
    {
      navigate,
      requestAccessTokenRefresh,
      openSidePanelPage,
      openCommandConfirmationModal,
      enqueueSnackbar,
      unmountFrontComponent,
      closeSidePanel,
      updateProgress,
    };

  return {
    executionContext,
    frontComponentHostCommunicationApi,
  };
};
