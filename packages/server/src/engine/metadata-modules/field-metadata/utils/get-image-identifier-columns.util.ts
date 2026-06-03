import { compositeTypeDefinitions, FieldMetadataType } from 'shared/types';
import { isDefined } from 'shared/utils';

import { computeCompositeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { isCompositeFieldMetadataType } from 'src/engine/metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

export const getImageIdentifierColumnsFromFlatFieldMetadata = (
  imageField: FlatFieldMetadata | undefined | null,
): string[] => {
  if (!isDefined(imageField)) {
    return [];
  }

  const imageCompositeType = isCompositeFieldMetadataType(imageField.type)
    ? compositeTypeDefinitions.get(imageField.type)
    : undefined;

  if (isDefined(imageCompositeType)) {
    return imageCompositeType.properties.map((compositeProperty) =>
      computeCompositeColumnName(imageField.name, compositeProperty),
    );
  }

  return [imageField.name];
};

export const getImageIdentifierColumns = ({
  flatObjectMetadata,
  flatFieldMetadataMaps,
}: {
  flatObjectMetadata: FlatObjectMetadata;
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
}): string[] => {
  if (flatObjectMetadata.nameSingular === 'workspaceMember') {
    return ['avatarUrl'];
  }

  if (!isDefined(flatObjectMetadata.imageIdentifierFieldMetadataId)) {
    return [];
  }

  const imageField = findFlatEntityByIdInFlatEntityMaps({
    flatEntityMaps: flatFieldMetadataMaps,
    flatEntityId: flatObjectMetadata.imageIdentifierFieldMetadataId,
  });

  return getImageIdentifierColumnsFromFlatFieldMetadata(imageField);
};

// Kolom utama untuk membaca nilai image dari raw record (SELECT hasil query).
// LINKS → primaryLinkUrl; TEXT/FILE → nama field flat.
export const getImageIdentifierPrimaryColumnFromFlatFieldMetadata = (
  imageField: FlatFieldMetadata | undefined | null,
): string | null => {
  if (!isDefined(imageField)) {
    return null;
  }

  if (imageField.type === FieldMetadataType.LINKS) {
    return computeCompositeColumnName(imageField.name, {
      name: 'primaryLinkUrl',
      type: FieldMetadataType.TEXT,
      hidden: false,
      isRequired: false,
    });
  }

  if (isCompositeFieldMetadataType(imageField.type)) {
    const compositeType = compositeTypeDefinitions.get(imageField.type);

    if (isDefined(compositeType) && compositeType.properties.length > 0) {
      return computeCompositeColumnName(
        imageField.name,
        compositeType.properties[0],
      );
    }
  }

  return imageField.name;
};

export const getImageIdentifierPrimaryColumn = ({
  flatObjectMetadata,
  flatFieldMetadataMaps,
}: {
  flatObjectMetadata: FlatObjectMetadata;
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
}): string | null => {
  if (flatObjectMetadata.nameSingular === 'workspaceMember') {
    return 'avatarUrl';
  }

  if (!isDefined(flatObjectMetadata.imageIdentifierFieldMetadataId)) {
    return null;
  }

  const imageField = findFlatEntityByIdInFlatEntityMaps({
    flatEntityMaps: flatFieldMetadataMaps,
    flatEntityId: flatObjectMetadata.imageIdentifierFieldMetadataId,
  });

  return getImageIdentifierPrimaryColumnFromFlatFieldMetadata(imageField);
};
