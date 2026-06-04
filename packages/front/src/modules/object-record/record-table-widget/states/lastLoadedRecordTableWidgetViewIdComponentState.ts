import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';
import { type ViewType } from '@/views/types/ViewType';

export const lastLoadedRecordTableWidgetViewIdComponentState =
  createAtomComponentState<{
    viewId: string;
    objectMetadataItemUpdatedAt: string;
    loadedViewContentSignature: string;
    loadedDisplayViewType: ViewType.TABLE | ViewType.MAP;
  } | null>({
    key: 'lastLoadedRecordTableWidgetViewIdComponentState',
    defaultValue: null,
    componentInstanceContext: ContextStoreComponentInstanceContext,
  });
