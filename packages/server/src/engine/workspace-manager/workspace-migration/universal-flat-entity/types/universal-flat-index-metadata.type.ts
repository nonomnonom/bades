import { type CastRecordTypeOrmDatePropertiesToString } from 'src/engine/metadata-modules/flat-entity/types/cast-record-typeorm-date-properties-to-string.type';
import { type IndexFieldMetadataEntity } from 'src/engine/metadata-modules/index-metadata/index-field-metadata.entity';
import { type IndexMetadataEntity } from 'src/engine/metadata-modules/index-metadata/index-metadata.entity';
import { type UniversalFlatEntityFrom } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-entity-from.type';

// Note: IndexFieldMetadataEntity berada di antara SyncableEntity dan jsonb; perlu ditentukan pendekatan yang seragam
export type UniversalFlatIndexFieldMetadata = Omit<
  IndexFieldMetadataEntity,
  | 'indexMetadataId'
  | 'indexMetadata'
  | 'fieldMetadataId'
  | 'fieldMetadata'
  | 'id'
  | 'workspaceId'
  | 'workspace'
  | keyof CastRecordTypeOrmDatePropertiesToString<IndexFieldMetadataEntity>
> & {
  indexMetadataUniversalIdentifier: string;
  fieldMetadataUniversalIdentifier: string;
} & CastRecordTypeOrmDatePropertiesToString<IndexFieldMetadataEntity>;

export type UniversalFlatIndexMetadata =
  UniversalFlatEntityFrom<IndexMetadataEntity> & {
    universalFlatIndexFieldMetadatas: UniversalFlatIndexFieldMetadata[];
  };
