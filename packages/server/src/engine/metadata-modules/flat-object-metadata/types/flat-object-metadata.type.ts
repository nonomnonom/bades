import { type FlatEntityFrom } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-from.type';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';

type BaseFlatObjectMetadata = FlatEntityFrom<
  Omit<ObjectMetadataEntity, 'dataSourceId'>
>;
export type FlatObjectMetadata = BaseFlatObjectMetadata & {
  // NOTE: field berikut belum masuk ke UniversalFlatEntity; harus didefinisikan di sumber yang sama
  // TODO hapus setelah labelIdentifierFieldMetadataId diselesaikan
  labelIdentifierFieldMetadataUniversalIdentifier: string | null;
  imageIdentifierFieldMetadataUniversalIdentifier: string | null;
};
