import { useContextStoreObjectMetadataItemOrThrow } from '@/context-store/hooks/useContextStoreObjectMetadataItemOrThrow';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { useLoadRecordIndexStates } from '@/object-record/record-index/hooks/useLoadRecordIndexStates';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { useCreateDefaultViewForObject } from '@/views/hooks/useCreateDefaultViewForObject';
import { viewFromViewIdFamilySelector } from '@/views/states/selectors/viewFromViewIdFamilySelector';
import { useEffect, useRef } from 'react';
import { isDefined } from 'shared/utils';

export const RecordIndexLoadBaseOnContextStoreEffect = () => {
  const { loadRecordIndexStates } = useLoadRecordIndexStates();
  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
  );

  const loadedViewIdRef = useRef<string | undefined>(undefined);

  const view = useAtomFamilySelectorValue(viewFromViewIdFamilySelector, {
    viewId: contextStoreCurrentViewId ?? '',
  });

  const { objectMetadataItem } = useContextStoreObjectMetadataItemOrThrow();

  const { createDefaultViewForObject } = useCreateDefaultViewForObject();

  useEffect(() => {
    if (
      isDefined(contextStoreCurrentViewId) &&
      loadedViewIdRef.current === contextStoreCurrentViewId
    ) {
      return;
    }

    if (!isDefined(objectMetadataItem)) {
      return;
    }

    if (isDefined(view)) {
      loadRecordIndexStates(view, objectMetadataItem);
      loadedViewIdRef.current = contextStoreCurrentViewId;
    } else {
      createDefaultViewForObject(objectMetadataItem);
    }
  }, [
    contextStoreCurrentViewId,
    loadRecordIndexStates,
    objectMetadataItem,
    view,
    createDefaultViewForObject,
  ]);

  return <></>;
};
