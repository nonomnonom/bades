import { computeMorphOrRelationFieldJoinColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util';
import { type FieldMetadataSettingsMapping, RelationType } from 'shared/types';

export const formatColumnNameForRelationField = (
  fieldName: string,
  fieldMetadataSettings: FieldMetadataSettingsMapping['RELATION'],
): string => {
  if (fieldMetadataSettings.relationType === RelationType.ONE_TO_MANY) {
    throw new Error('Tidak ada kolom untuk relasi satu ke banyak');
  }

  if (fieldMetadataSettings.relationType === RelationType.MANY_TO_ONE) {
    return computeMorphOrRelationFieldJoinColumnName({ name: fieldName });
  }

  return fieldName;
};
