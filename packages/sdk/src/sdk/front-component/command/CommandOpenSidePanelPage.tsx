import {
  openSidePanelPage,
  unmountFrontComponent,
  useFrontComponentId,
} from '@/sdk/front-component';
import { useEffect, useRef } from 'react';

import { type SidePanelPages } from 'shared/types';

export type CommandOpenSidePanelPageProps = {
  page: SidePanelPages;
  pageTitle: string;
  pageIcon: string;
  onClick?: () => void;
  shouldResetSearchState?: boolean;
};

export const CommandOpenSidePanelPage = ({
  page,
  pageTitle,
  pageIcon,
  onClick,
  shouldResetSearchState = false,
}: CommandOpenSidePanelPageProps) => {
  const hasExecutedRef = useRef(false);

  const frontComponentId = useFrontComponentId();

  useEffect(() => {
    if (hasExecutedRef.current) {
      return;
    }

    hasExecutedRef.current = true;

    const run = async () => {
      onClick?.();

      await openSidePanelPage({
        page,
        pageTitle,
        pageIcon,
        shouldResetSearchState,
      });

      await unmountFrontComponent();
    };

    run();
  }, [
    page,
    pageTitle,
    pageIcon,
    shouldResetSearchState,
    onClick,
    frontComponentId,
  ]);

  return null;
};
