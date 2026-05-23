import { useLingui } from '~/utils/i18n/badesI18n';
import { useMemo } from 'react';

import { IconArrowMerge, IconSettings } from 'ui/display';

import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { type SingleTabProps } from '@/ui/layout/tab-list/types/SingleTabProps';
import { MergeRecordsTabId } from '@/object-record/record-merge/types/MergeRecordsTabId';
import { getPositionNumberIcon } from '@/object-record/record-merge/utils/getPositionNumberIcon';
import { getPositionWordLabel } from '@/object-record/record-merge/utils/getPositionWordLabel';

export const useMergeRecordsContainerTabs = (
  selectedRecords: ObjectRecord[],
): { tabs: SingleTabProps[] } => {
  const { t } = useLingui();

  const tabs = useMemo(() => {
    const mergePreviewTab: SingleTabProps = {
      id: MergeRecordsTabId.MERGE_PREVIEW,
      title: ""Merge preview",
      Icon: IconArrowMerge,
    };

    const recordTabs: SingleTabProps[] = selectedRecords.map(
      (record, index) => ({
        id: record.id,
        title: getPositionWordLabel(index),
        Icon: getPositionNumberIcon(index),
      }),
    );

    const settingsTab: SingleTabProps = {
      id: MergeRecordsTabId.SETTINGS,
      title: "Pengaturan",
      Icon: IconSettings,
    };

    return [mergePreviewTab, ...recordTabs, settingsTab];
  }, [t, selectedRecords]);

  return { tabs };
};
