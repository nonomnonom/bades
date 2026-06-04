import { WIDGET_SIZES } from '@/page-layout/constants/WidgetSizes';
import { useCreatePageLayoutTab } from '@/page-layout/hooks/useCreatePageLayoutTab';
import { PageLayoutComponentInstanceContext } from '@/page-layout/states/contexts/PageLayoutComponentInstanceContext';
import { pageLayoutCurrentLayoutsComponentState } from '@/page-layout/states/pageLayoutCurrentLayoutsComponentState';
import { pageLayoutDraftComponentState } from '@/page-layout/states/pageLayoutDraftComponentState';
import { pageLayoutDraggedAreaComponentState } from '@/page-layout/states/pageLayoutDraggedAreaComponentState';
import { addWidgetToTab } from '@/page-layout/utils/addWidgetToTab';
import { createDefaultStandaloneRichTextWidget } from '@/page-layout/utils/createDefaultStandaloneRichTextWidget';
import { getDefaultWidgetPosition } from '@/page-layout/utils/getDefaultWidgetPosition';
import { getUpdatedTabLayouts } from '@/page-layout/utils/getUpdatedTabLayouts';
import { resolveActiveTabIdForPageLayoutWidgetCreation } from '@/page-layout/utils/resolveActiveTabIdForPageLayoutWidgetCreation';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useAtomComponentStateCallbackState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateCallbackState';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  type PageLayoutWidget,
  type RichTextBody,
  WidgetType,
} from '~/generated-metadata/graphql';

export const useCreatePageLayoutStandaloneRichTextWidget = ({
  pageLayoutId: pageLayoutIdFromProps,
  tabListInstanceId,
}: {
  pageLayoutId: string;
  tabListInstanceId: string;
}) => {
  const pageLayoutId = useAvailableComponentInstanceIdOrThrow(
    PageLayoutComponentInstanceContext,
    pageLayoutIdFromProps,
  );

  const { createPageLayoutTab } = useCreatePageLayoutTab({
    pageLayoutId,
    tabListInstanceId,
  });

  const store = useStore();

  const pageLayoutCurrentLayoutsState = useAtomComponentStateCallbackState(
    pageLayoutCurrentLayoutsComponentState,
    pageLayoutId,
  );

  const pageLayoutDraggedAreaState = useAtomComponentStateCallbackState(
    pageLayoutDraggedAreaComponentState,
    pageLayoutId,
  );

  const pageLayoutDraftState = useAtomComponentStateCallbackState(
    pageLayoutDraftComponentState,
    pageLayoutId,
  );

  const createPageLayoutStandaloneRichTextWidget = useCallback(
    (body: RichTextBody): PageLayoutWidget => {
      const activeTabId =
        resolveActiveTabIdForPageLayoutWidgetCreation({
          store,
          tabListInstanceId,
          pageLayoutDraftState,
        }) ?? createPageLayoutTab();

      const allTabLayouts = store.get(pageLayoutCurrentLayoutsState);

      const pageLayoutDraggedArea = store.get(pageLayoutDraggedAreaState);

      const widgetId = uuidv4();
      const richTextSize = WIDGET_SIZES[WidgetType.STANDALONE_RICH_TEXT]!;
      const defaultRichTextSize = richTextSize.default;
      const minimumSize = richTextSize.minimum;
      const position = getDefaultWidgetPosition(
        pageLayoutDraggedArea,
        defaultRichTextSize,
        minimumSize,
      );

      const newWidget = createDefaultStandaloneRichTextWidget(
        widgetId,
        activeTabId,

        body,
        {
          row: position.y,
          column: position.x,
          rowSpan: position.h,
          columnSpan: position.w,
        },
      );

      const newLayout = {
        i: widgetId,
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h,
        minW: minimumSize.w,
        minH: minimumSize.h,
      };

      const updatedLayouts = getUpdatedTabLayouts(
        allTabLayouts,
        activeTabId,
        newLayout,
      );

      store.set(pageLayoutCurrentLayoutsState, updatedLayouts);

      store.set(pageLayoutDraftState, (prev) => ({
        ...prev,
        tabs: addWidgetToTab(prev.tabs, activeTabId, newWidget),
      }));

      store.set(pageLayoutDraggedAreaState, null);

      return newWidget;
    },
    [
      tabListInstanceId,
      createPageLayoutTab,
      pageLayoutCurrentLayoutsState,
      pageLayoutDraftState,
      pageLayoutDraggedAreaState,
      store,
    ],
  );

  return { createPageLayoutStandaloneRichTextWidget };
};
