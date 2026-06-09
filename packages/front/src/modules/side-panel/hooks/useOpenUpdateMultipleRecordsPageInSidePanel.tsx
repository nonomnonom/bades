import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { SidePanelPages } from 'shared/types';

import { useCallback } from 'react';
import { IconBoxMultiple } from 'ui/display';

type UseOpenUpdateMultipleRecordsPageInSidePanelProps = {
  contextStoreInstanceId: string;
};

export const useOpenUpdateMultipleRecordsPageInSidePanel = ({
  contextStoreInstanceId,
}: UseOpenUpdateMultipleRecordsPageInSidePanelProps) => {
  const { navigateSidePanel } = useNavigateSidePanel();

  const openUpdateMultipleRecordsPageInSidePanel = useCallback(async () => {
    navigateSidePanel({
      page: SidePanelPages.UpdateRecords,
      pageTitle: `Perbarui data`,
      pageIcon: IconBoxMultiple,
      pageId: contextStoreInstanceId,
    });
  }, [navigateSidePanel, contextStoreInstanceId]);

  return {
    openUpdateMultipleRecordsPageInSidePanel,
  };
};
