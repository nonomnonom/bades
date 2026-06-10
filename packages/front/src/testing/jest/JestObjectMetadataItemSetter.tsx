import { type ReactNode } from 'react';

import { useUpdateMetadataStoreDraft } from '@/metadata-store/hooks/useUpdateMetadataStoreDraft';
import { splitCompositeObjectMetadataItems } from '@/metadata-store/utils/splitCompositeObjectMetadataItems';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';

export const JestObjectMetadataItemSetter = ({
  children,
  objectMetadataItems,
}: {
  children: ReactNode;
  objectMetadataItems?: EnrichedObjectMetadataItem[];
}) => {
  const { replaceDraft, applyChanges } = useUpdateMetadataStoreDraft();

  const items =
    objectMetadataItems ?? getTestEnrichedObjectMetadataItemsMock();
  const { flatObjects, flatFields, flatIndexes } =
    splitCompositeObjectMetadataItems(items);

  replaceDraft('objectMetadataItems', flatObjects);
  replaceDraft('fieldMetadataItems', flatFields);
  replaceDraft('indexMetadataItems', flatIndexes);
  applyChanges();

  return <>{children}</>;
};
