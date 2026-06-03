import { isNonEmptyString } from '@sniptt/guards';
import { FieldMetadataType, FileFolder } from 'shared/types';
import { isDefined } from 'shared/utils';

import { extractFileIdFromUrl } from 'src/engine/core-modules/file/files-field/utils/extract-file-id-from-url.util';
import { getImageIdentifierPrimaryColumnFromFlatFieldMetadata } from 'src/engine/metadata-modules/field-metadata/utils/get-image-identifier-columns.util';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

type GetRecordImageIdentifierOptions = {
  record: Record<string, unknown>;
  flatObjectMetadata: FlatObjectMetadata;
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
  signUrl?: (
    fileId: string,
    fileFolder: FileFolder,
  ) => Promise<string | null> | string | null;
};

export const getRecordImageIdentifier = async ({
  record,
  flatObjectMetadata,
  flatFieldMetadataMaps,
  signUrl,
}: GetRecordImageIdentifierOptions): Promise<string | null> => {
  if (
    signUrl &&
    flatObjectMetadata.nameSingular === 'workspaceMember' &&
    isDefined(record.avatarUrl)
  ) {
    const avatarFileId = extractFileIdFromUrl(
      record.avatarUrl as string,
      FileFolder.CorePicture,
    );
    if (!isDefined(avatarFileId)) {
      return null;
    }
    return signUrl(avatarFileId, FileFolder.CorePicture);
  }

  if (!isDefined(flatObjectMetadata.imageIdentifierFieldMetadataId)) {
    return null;
  }

  const imageIdentifierField = findFlatEntityByIdInFlatEntityMaps({
    flatEntityMaps: flatFieldMetadataMaps,
    flatEntityId: flatObjectMetadata.imageIdentifierFieldMetadataId,
  });

  if (!isDefined(imageIdentifierField)) {
    return null;
  }

  const imagePrimaryColumn =
    getImageIdentifierPrimaryColumnFromFlatFieldMetadata(imageIdentifierField);

  if (!isDefined(imagePrimaryColumn)) {
    return null;
  }

  const imageValue = record[imagePrimaryColumn];

  if (!isDefined(imageValue)) {
    return null;
  }

  const rawImageValue = String(imageValue);

  if (!isNonEmptyString(rawImageValue)) {
    return null;
  }

  if (signUrl && imageIdentifierField.type === FieldMetadataType.LINKS) {
    const fileId = extractFileIdFromUrl(rawImageValue, FileFolder.FilesField);

    if (!isDefined(fileId)) {
      return rawImageValue;
    }

    return signUrl(fileId, FileFolder.FilesField);
  }

  if (signUrl) {
    return signUrl(rawImageValue, FileFolder.FilesField);
  }

  return rawImageValue;
};
