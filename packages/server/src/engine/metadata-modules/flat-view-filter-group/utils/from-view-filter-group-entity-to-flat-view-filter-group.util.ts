import { isDefined, removePropertiesFromRecord } from 'shared/utils';

import {
  FlatEntityMapsException,
  FlatEntityMapsExceptionCode,
} from 'src/engine/metadata-modules/flat-entity/exceptions/flat-entity-maps.exception';
import { getMetadataEntityRelationProperties } from 'src/engine/metadata-modules/flat-entity/utils/get-metadata-entity-relation-properties.util';
import { type FlatViewFilterGroup } from 'src/engine/metadata-modules/flat-view-filter-group/types/flat-view-filter-group.type';
import { type FromEntityToFlatEntityArgs } from 'src/engine/workspace-cache/types/from-entity-to-flat-entity-args.type';

type FromViewFilterGroupEntityToFlatViewFilterGroupArgs =
  FromEntityToFlatEntityArgs<'viewFilterGroup'> & {
    viewFilterGroupIdToUniversalIdentifierMap: Map<string, string>;
  };

export const fromViewFilterGroupEntityToFlatViewFilterGroup = ({
  entity: viewFilterGroupEntity,
  applicationIdToUniversalIdentifierMap,
  viewFilterGroupIdToUniversalIdentifierMap,
  viewIdToUniversalIdentifierMap,
}: FromViewFilterGroupEntityToFlatViewFilterGroupArgs): FlatViewFilterGroup => {
  const viewFilterGroupEntityWithoutRelations = removePropertiesFromRecord(
    viewFilterGroupEntity,
    getMetadataEntityRelationProperties('viewFilterGroup'),
  );

  const applicationUniversalIdentifier =
    applicationIdToUniversalIdentifierMap.get(
      viewFilterGroupEntity.applicationId,
    );

  if (!isDefined(applicationUniversalIdentifier)) {
    throw new FlatEntityMapsException(
      `Aplikasi dengan id ${viewFilterGroupEntity.applicationId} tidak ditemukan untuk viewFilterGroup ${viewFilterGroupEntity.id}`,
      FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND,
    );
  }

  let parentViewFilterGroupUniversalIdentifier: string | null = null;

  if (isDefined(viewFilterGroupEntity.parentViewFilterGroupId)) {
    parentViewFilterGroupUniversalIdentifier =
      viewFilterGroupIdToUniversalIdentifierMap.get(
        viewFilterGroupEntity.parentViewFilterGroupId,
      ) ?? null;

    if (!isDefined(parentViewFilterGroupUniversalIdentifier)) {
      throw new FlatEntityMapsException(
        `ViewFilterGroup dengan id ${viewFilterGroupEntity.parentViewFilterGroupId} tidak ditemukan untuk viewFilterGroup ${viewFilterGroupEntity.id}`,
        FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND,
      );
    }
  }

  const viewUniversalIdentifier = viewIdToUniversalIdentifierMap.get(
    viewFilterGroupEntity.viewId,
  );

  if (!isDefined(viewUniversalIdentifier)) {
    throw new FlatEntityMapsException(
      `Tampilan dengan id ${viewFilterGroupEntity.viewId} tidak ditemukan untuk viewFilterGroup ${viewFilterGroupEntity.id}`,
      FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND,
    );
  }

  return {
    ...viewFilterGroupEntityWithoutRelations,
    createdAt: viewFilterGroupEntity.createdAt.toISOString(),
    updatedAt: viewFilterGroupEntity.updatedAt.toISOString(),
    deletedAt: viewFilterGroupEntity.deletedAt?.toISOString() ?? null,
    universalIdentifier:
      viewFilterGroupEntityWithoutRelations.universalIdentifier,
    viewFilterIds: viewFilterGroupEntity.viewFilters?.map(({ id }) => id) ?? [],
    childViewFilterGroupIds:
      viewFilterGroupEntity.childViewFilterGroups?.map(({ id }) => id) ?? [],
    applicationUniversalIdentifier,
    parentViewFilterGroupUniversalIdentifier,
    viewUniversalIdentifier,
    viewFilterUniversalIdentifiers:
      viewFilterGroupEntity.viewFilters?.map(
        ({ universalIdentifier }) => universalIdentifier,
      ) ?? [],
    childViewFilterGroupUniversalIdentifiers:
      viewFilterGroupEntity.childViewFilterGroups?.map(
        ({ universalIdentifier }) => universalIdentifier,
      ) ?? [],
  };
};
