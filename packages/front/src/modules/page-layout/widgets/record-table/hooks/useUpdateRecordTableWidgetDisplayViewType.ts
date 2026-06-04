import { useUpdatePageLayoutWidget } from '@/page-layout/hooks/useUpdatePageLayoutWidget';
import { recordTableWidgetViewDraftComponentState } from '@/page-layout/states/recordTableWidgetViewDraftComponentState';
import { useRecordTableWidgetViewForDisplay } from '@/page-layout/widgets/record-table/hooks/useRecordTableWidgetViewForDisplay';
import { useLoadRecordIndexStates } from '@/object-record/record-index/hooks/useLoadRecordIndexStates';
import { useObjectMetadataItemById } from '@/object-metadata/hooks/useObjectMetadataItemById';
import { useAtomComponentStateCallbackState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateCallbackState';
import { ViewType } from '@/views/types/ViewType';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { isDefined } from 'shared/utils';
import { WidgetConfigurationType } from '~/generated-metadata/graphql';

type UseUpdateRecordTableWidgetDisplayViewTypeParams = {
  pageLayoutId: string;
  widgetId: string;
  viewId: string;
  objectMetadataId: string;
};

export const useUpdateRecordTableWidgetDisplayViewType = ({
  pageLayoutId,
  widgetId,
  viewId,
  objectMetadataId,
}: UseUpdateRecordTableWidgetDisplayViewTypeParams) => {
  const { updatePageLayoutWidget } = useUpdatePageLayoutWidget(pageLayoutId);
  const { view } = useRecordTableWidgetViewForDisplay({
    pageLayoutId,
    widgetId,
    viewId,
  });
  const { objectMetadataItem } = useObjectMetadataItemById({
    objectId: objectMetadataId,
  });
  const { loadRecordIndexStates } = useLoadRecordIndexStates();

  const recordTableWidgetViewDraftState = useAtomComponentStateCallbackState(
    recordTableWidgetViewDraftComponentState,
    pageLayoutId,
  );

  const store = useStore();

  const updateRecordTableWidgetDisplayViewType = useCallback(
    (displayViewType: ViewType.TABLE | ViewType.MAP) => {
      store.set(recordTableWidgetViewDraftState, (prev) => {
        const widgetDraft = prev[widgetId];

        if (!isDefined(widgetDraft)) {
          return prev;
        }

        return {
          ...prev,
          [widgetId]: {
            ...widgetDraft,
            displayViewType,
          },
        };
      });

      updatePageLayoutWidget(widgetId, {
        configuration: {
          configurationType: WidgetConfigurationType.RECORD_TABLE,
          viewId,
          displayViewType: displayViewType === ViewType.MAP ? 'MAP' : 'TABLE',
        },
      });

      if (isDefined(view)) {
        loadRecordIndexStates(
          {
            ...view,
            type: displayViewType,
          },
          objectMetadataItem,
        );
      }
    },
    [
      loadRecordIndexStates,
      objectMetadataItem,
      recordTableWidgetViewDraftState,
      store,
      updatePageLayoutWidget,
      view,
      viewId,
      widgetId,
    ],
  );

  return { updateRecordTableWidgetDisplayViewType };
};
