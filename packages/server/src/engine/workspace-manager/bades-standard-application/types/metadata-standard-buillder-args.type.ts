import { type AllMetadataName } from 'shared/metadata';

import { type MetadataValidationRelatedUniversalFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/metadata-related-types.type';
import { type StandardObjectMetadataRelatedEntityIds } from 'src/engine/workspace-manager/bades-standard-application/utils/get-standard-object-metadata-related-entity-ids.util';
import { type ComputeBadesStandardApplicationAllFlatEntityMapsArgs } from 'src/engine/workspace-manager/bades-standard-application/utils/bades-standard-application-all-flat-entity-maps.constant';

export type StandardBuilderArgs<T extends AllMetadataName> = {
  standardObjectMetadataRelatedEntityIds: StandardObjectMetadataRelatedEntityIds;
  dependencyFlatEntityMaps: MetadataValidationRelatedUniversalFlatEntityMaps<T>;
} & ComputeBadesStandardApplicationAllFlatEntityMapsArgs;
