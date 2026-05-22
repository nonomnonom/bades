import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/bades-standard-application/types/all-standard-object-index-name.type';
import {
  type CreateStandardIndexArgs,
  createStandardIndexFlatMetadata,
} from 'src/engine/workspace-manager/bades-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildOpportunityStandardFlatIndexMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  badesStandardApplicationId,
}: Omit<CreateStandardIndexArgs<'opportunity'>, 'context'>): Record<
  AllStandardObjectIndexName<'opportunity'>,
  FlatIndexMetadata
> => ({
  pointOfContactIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'pointOfContactIdIndex',
      relatedFieldNames: ['pointOfContact'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    badesStandardApplicationId,
    now,
  }),
  companyIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'companyIdIndex',
      relatedFieldNames: ['company'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    badesStandardApplicationId,
    now,
  }),
  stageIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'stageIndex',
      relatedFieldNames: ['stage'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    badesStandardApplicationId,
    now,
  }),
  searchVectorGinIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'searchVectorGinIndex',
      relatedFieldNames: ['searchVector'],
      indexType: IndexType.GIN,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    badesStandardApplicationId,
    now,
  }),
});
