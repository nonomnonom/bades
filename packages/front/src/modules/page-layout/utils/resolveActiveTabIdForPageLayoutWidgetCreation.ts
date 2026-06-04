import { type DraftPageLayout } from '@/page-layout/types/DraftPageLayout';
import { type PageLayoutTab } from '@/page-layout/types/PageLayoutTab';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { type createStore, type WritableAtom } from 'jotai';
import { isDefined } from 'shared/utils';

type ResolveActiveTabIdForPageLayoutWidgetCreationParams = {
  store: ReturnType<typeof createStore>;
  tabListInstanceId: string;
  pageLayoutDraftState: WritableAtom<
    DraftPageLayout,
    [DraftPageLayout | ((prev: DraftPageLayout) => DraftPageLayout)],
    void
  >;
};

/**
 * Mencari active tab ID untuk pembuatan widget.
 * Jika tidak ada active tab, fallback ke tab pertama yang aktif atau tab pertama.
 * Throw error jika benar-benar tidak ada tab — caller harus handle dengan
 * auto-create tab (mis. via useCreatePageLayoutTab).
 */
export const resolveActiveTabIdForPageLayoutWidgetCreation = ({
  store,
  tabListInstanceId,
  pageLayoutDraftState,
}: ResolveActiveTabIdForPageLayoutWidgetCreationParams): string | null => {
  const activeTabId = store.get(
    activeTabIdComponentState.atomFamily({
      instanceId: tabListInstanceId,
    }),
  );

  if (isDefined(activeTabId)) {
    return activeTabId;
  }

  const pageLayoutDraft = store.get(pageLayoutDraftState);
  const fallbackTabId =
    pageLayoutDraft.tabs.find((tab: PageLayoutTab) => tab.isActive)?.id ??
    pageLayoutDraft.tabs[0]?.id;

  if (isDefined(fallbackTabId)) {
    return fallbackTabId;
  }

  // Tidak ada tab sama sekali — caller harus auto-create tab
  return null;
};
