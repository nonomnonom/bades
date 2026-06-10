import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { RecordFilterGroupsComponentInstanceContext } from '@/object-record/record-filter-group/states/context/RecordFilterGroupsComponentInstanceContext';
import { RecordFiltersComponentInstanceContext } from '@/object-record/record-filter/states/context/RecordFiltersComponentInstanceContext';
import { RecordSortsComponentInstanceContext } from '@/object-record/record-sort/states/context/RecordSortsComponentInstanceContext';
import { RecordIndexContextProvider } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useMemo, type PropsWithChildren } from 'react';
import { useRecordIndexFieldMetadataDerivedStates } from '@/object-record/record-index/hooks/useRecordIndexFieldMetadataDerivedStates';

const RECORD_INDEX_ID = 'recordIndexId';

type JestRecordIndexContextProviderWrapperProps = {
  objectMetadataItem: EnrichedObjectMetadataItem;
} & PropsWithChildren;

export const JestRecordIndexContextProviderWrapper = ({
  objectMetadataItem,
  children,
}: JestRecordIndexContextProviderWrapperProps) => {
  const {
    fieldDefinitionByFieldMetadataItemId,
    fieldMetadataItemByFieldMetadataItemId,
    labelIdentifierFieldMetadataItem,
    recordFieldByFieldMetadataItemId,
  } = useRecordIndexFieldMetadataDerivedStates(objectMetadataItem);

  const filterGroupsValue = useMemo(
    () => ({ instanceId: RECORD_INDEX_ID }),
    [],
  );

  const filtersValue = useMemo(() => ({ instanceId: RECORD_INDEX_ID }), []);

  const sortsValue = useMemo(() => ({ instanceId: RECORD_INDEX_ID }), []);

  return (
    <RecordFilterGroupsComponentInstanceContext.Provider
      value={filterGroupsValue}
    >
      <RecordFiltersComponentInstanceContext.Provider value={filtersValue}>
        <RecordSortsComponentInstanceContext.Provider value={sortsValue}>
          <RecordIndexContextProvider
            value={{
              objectPermissionsByObjectMetadataId: {},
              indexIdentifierUrl: () => 'indexIdentifierUrl',
              onIndexRecordsLoaded: () => {},
              objectNamePlural: objectMetadataItem.namePlural,
              objectNameSingular: objectMetadataItem.nameSingular,
              objectMetadataItem: objectMetadataItem,
              recordIndexId: RECORD_INDEX_ID,
              viewBarInstanceId: RECORD_INDEX_ID,
              labelIdentifierFieldMetadataItem,
              recordFieldByFieldMetadataItemId,
              fieldDefinitionByFieldMetadataItemId,
              fieldMetadataItemByFieldMetadataItemId,
            }}
          >
            {children}
          </RecordIndexContextProvider>
        </RecordSortsComponentInstanceContext.Provider>
      </RecordFiltersComponentInstanceContext.Provider>
    </RecordFilterGroupsComponentInstanceContext.Provider>
  );
};
