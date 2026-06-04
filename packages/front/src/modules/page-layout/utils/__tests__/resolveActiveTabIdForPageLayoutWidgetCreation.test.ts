import { pageLayoutDraftComponentState } from '@/page-layout/states/pageLayoutDraftComponentState';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { resolveActiveTabIdForPageLayoutWidgetCreation } from '@/page-layout/utils/resolveActiveTabIdForPageLayoutWidgetCreation';
import { createStore } from 'jotai';

describe('resolveActiveTabIdForPageLayoutWidgetCreation', () => {
  it('should return active tab id when already set', () => {
    const store = createStore();
    const tabListInstanceId = 'page-layout-1-tab-list';
    const pageLayoutDraftState = pageLayoutDraftComponentState.atomFamily({
      instanceId: 'page-layout-1',
    });

    store.set(
      activeTabIdComponentState.atomFamily({
        instanceId: tabListInstanceId,
      }),
      'tab-active',
    );

    store.set(pageLayoutDraftState, {
      id: 'page-layout-1',
      name: 'Dashboard',
      type: 'DASHBOARD' as never,
      objectMetadataId: null,
      tabs: [{ id: 'tab-fallback', isActive: true, widgets: [] } as never],
      defaultTabToFocusOnMobileAndSidePanelId: null,
    });

    expect(
      resolveActiveTabIdForPageLayoutWidgetCreation({
        store,
        tabListInstanceId,
        pageLayoutDraftState,
      }),
    ).toBe('tab-active');
  });

  it('should fall back to first active tab when active tab id is missing', () => {
    const store = createStore();
    const tabListInstanceId = 'page-layout-1-tab-list';
    const pageLayoutDraftState = pageLayoutDraftComponentState.atomFamily({
      instanceId: 'page-layout-1',
    });

    store.set(pageLayoutDraftState, {
      id: 'page-layout-1',
      name: 'Dashboard',
      type: 'DASHBOARD' as never,
      objectMetadataId: null,
      tabs: [{ id: 'tab-fallback', isActive: true, widgets: [] } as never],
      defaultTabToFocusOnMobileAndSidePanelId: null,
    });

    expect(
      resolveActiveTabIdForPageLayoutWidgetCreation({
        store,
        tabListInstanceId,
        pageLayoutDraftState,
      }),
    ).toBe('tab-fallback');
  });

  it('should throw when no tab is available', () => {
    const store = createStore();
    const tabListInstanceId = 'page-layout-1-tab-list';
    const pageLayoutDraftState = pageLayoutDraftComponentState.atomFamily({
      instanceId: 'page-layout-1',
    });

    store.set(pageLayoutDraftState, {
      id: 'page-layout-1',
      name: 'Dashboard',
      type: 'DASHBOARD' as never,
      objectMetadataId: null,
      tabs: [],
      defaultTabToFocusOnMobileAndSidePanelId: null,
    });

    expect(() =>
      resolveActiveTabIdForPageLayoutWidgetCreation({
        store,
        tabListInstanceId,
        pageLayoutDraftState,
      }),
    ).toThrow('Tab harus dipilih untuk membuat widget baru');
  });
});
