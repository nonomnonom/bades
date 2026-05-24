import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/bades-standard-application/types/all-standard-object-index-name.type';
import {
  type CreateStandardIndexArgs,
  createStandardIndexFlatMetadata,
} from 'src/engine/workspace-manager/bades-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildTaskTargetStandardFlatIndexMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  badesStandardApplicationId,
}: Omit<CreateStandardIndexArgs<'taskTarget'>, 'context'>): Record<
  AllStandardObjectIndexName<'taskTarget'>,
  FlatIndexMetadata
> => ({
  taskIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'taskIdIndex',
      relatedFieldNames: ['task'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    badesStandardApplicationId,
    now,
  }),
});
