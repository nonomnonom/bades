import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { RecordComponentInstanceContextsWrapper } from '@/object-record/components/RecordComponentInstanceContextsWrapper';
import { useObjectPermissionsForObject } from '@/object-record/hooks/useObjectPermissionsForObject';
import { RecordMap } from '@/object-record/record-map/components/RecordMap';
import { RecordMapContextProvider } from '@/object-record/record-map/contexts/RecordMapContext';

import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useGetCurrentViewOnly } from '@/views/hooks/useGetCurrentViewOnly';
import { isDefined } from 'shared/utils';

type RecordIndexMapContainerProps = {
  viewBarInstanceId: string;
};

export const RecordIndexMapContainer = ({
  viewBarInstanceId,
}: RecordIndexMapContainerProps) => {
  const { objectNameSingular } = useRecordIndexContextOrThrow();

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const objectPermissions = useObjectPermissionsForObject(
    objectMetadataItem.id,
  );

  const { currentView } = useGetCurrentViewOnly();

  if (!isDefined(currentView)) {
    return null;
  }

  return (
    <RecordComponentInstanceContextsWrapper
      componentInstanceId={`record-map-${objectNameSingular}`}
    >
      <RecordMapContextProvider
        value={{
          viewBarInstanceId,
          objectNameSingular,
          objectMetadataItem,
          objectPermissions,
        }}
      >
        <RecordMap />
      </RecordMapContextProvider>
    </RecordComponentInstanceContextsWrapper>
  );
};
