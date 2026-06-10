import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { getObjectPermissionsForObject } from '@/object-metadata/utils/getObjectPermissionsForObject';
import { RecordComponentInstanceContextsWrapper } from '@/object-record/components/RecordComponentInstanceContextsWrapper';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { RecordIndexContextProvider } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useRecordIndexFieldMetadataDerivedStates } from '@/object-record/record-index/hooks/useRecordIndexFieldMetadataDerivedStates';
import { RecordTableWidgetContextStoreInitEffect } from '@/object-record/record-table-widget/components/RecordTableWidgetContextStoreInitEffect';
import { RecordTableWidgetViewLoadEffect } from '@/object-record/record-table-widget/components/RecordTableWidgetViewLoadEffect';
import { getRecordIndexIdFromObjectNamePluralAndViewId } from '@/object-record/utils/getRecordIndexIdFromObjectNamePluralAndViewId';
import { ViewComponentInstanceContext } from '@/views/states/contexts/ViewComponentInstanceContext';
import { type PropsWithChildren, useCallback, useMemo } from 'react';
import { AppPath } from 'shared/types';
import { getAppPath } from 'shared/utils';
import { type PageLayoutWidget } from '~/generated-metadata/graphql';

type RecordTableWidgetProviderProps = PropsWithChildren<{
  objectNameSingular: string;
  viewId: string;
  widgetId: string;
  widget?: PageLayoutWidget;
}>;

export const RecordTableWidgetProvider = ({
  objectNameSingular,
  viewId,
  widgetId,
  widget,
  children,
}: RecordTableWidgetProviderProps) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const recordIndexId = getRecordIndexIdFromObjectNamePluralAndViewId(
    objectMetadataItem.namePlural,
    viewId,
  );

  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const objectPermissions = getObjectPermissionsForObject(
    objectPermissionsByObjectMetadataId,
    objectMetadataItem.id,
  );

  const {
    fieldDefinitionByFieldMetadataItemId,
    fieldMetadataItemByFieldMetadataItemId,
    labelIdentifierFieldMetadataItem,
    recordFieldByFieldMetadataItemId,
  } = useRecordIndexFieldMetadataDerivedStates(
    objectMetadataItem,
    recordIndexId,
  );

  const indexIdentifierUrl = useCallback(
    (recordId: string) => {
      return getAppPath(AppPath.RecordShowPage, {
        objectNameSingular,
        objectRecordId: recordId,
      });
    },
    [objectNameSingular],
  );

  const handleIndexRecordsLoaded = useCallback(() => {}, []);

  const contextStoreInstanceContextValue = useMemo(
    () => ({ instanceId: `record-table-widget-${widgetId}` }),
    [widgetId],
  );

  const recordIndexContextValue = useMemo(
    () => ({
      objectPermissionsByObjectMetadataId,
      recordIndexId,
      viewBarInstanceId: recordIndexId,
      objectNamePlural: objectMetadataItem.namePlural,
      objectNameSingular,
      objectMetadataItem,
      onIndexRecordsLoaded: handleIndexRecordsLoaded,
      indexIdentifierUrl,
      recordFieldByFieldMetadataItemId,
      labelIdentifierFieldMetadataItem,
      fieldMetadataItemByFieldMetadataItemId,
      fieldDefinitionByFieldMetadataItemId,
    }),
    [
      objectPermissionsByObjectMetadataId,
      recordIndexId,
      objectMetadataItem.namePlural,
      objectNameSingular,
      objectMetadataItem,
      handleIndexRecordsLoaded,
      indexIdentifierUrl,
      recordFieldByFieldMetadataItemId,
      labelIdentifierFieldMetadataItem,
      fieldMetadataItemByFieldMetadataItemId,
      fieldDefinitionByFieldMetadataItemId,
    ],
  );

  if (!objectPermissions.canReadObjectRecords) {
    return null;
  }

  return (
    <ContextStoreComponentInstanceContext.Provider
      value={contextStoreInstanceContextValue}
    >
      <RecordTableWidgetContextStoreInitEffect
        objectMetadataItemId={objectMetadataItem.id}
        viewId={viewId}
      />
      <RecordIndexContextProvider value={recordIndexContextValue}>
        <ViewComponentInstanceContext.Provider
          value={{ instanceId: recordIndexId }}
        >
          <RecordComponentInstanceContextsWrapper
            componentInstanceId={recordIndexId}
          >
            <RecordTableWidgetViewLoadEffect
              viewId={viewId}
              widgetId={widgetId}
              objectMetadataItem={objectMetadataItem}
              widget={widget}
            />
            {children}
          </RecordComponentInstanceContextsWrapper>
        </ViewComponentInstanceContext.Provider>
      </RecordIndexContextProvider>
    </ContextStoreComponentInstanceContext.Provider>
  );
};
