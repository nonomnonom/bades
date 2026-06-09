import { type CreateObjectInput } from 'src/engine/metadata-modules/object-metadata/dtos/create-object.input';

export type ObjectMetadataSeed = Omit<
  CreateObjectInput,
  'workspaceId' | 'fields'
> & {
  skipNameField?: boolean;
  /**
   * Nama field domain yang dipakai sebagai label identifier (main display
   * field) setelah object dibuat. Jika diisi, service akan memanggil
   * updateOneObject untuk set labelIdentifierFieldMetadataId ke field dengan
   * nama ini. Jika tidak diisi, engine default (field `name`) yang dipakai.
   */
  labelIdentifierFieldName?: string;
  /**
   * Nama field domain yang dipakai sebagai image identifier (avatar/foto
   * record) setelah object dibuat. Harus bertipe LINKS atau FILE.
   * Jika diisi, service akan memanggil updateOneObject untuk set
   * imageIdentifierFieldMetadataId ke field dengan nama ini.
   */
  imageIdentifierFieldName?: string;
};
