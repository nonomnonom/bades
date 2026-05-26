import { isDefined } from '@/utils/validation/isDefined';

export const getUniqueConstraintsFields = <
  K extends {
    id: string;
    name: string;
  },
  T extends {
    id: string;
    indexMetadatas: {
      id: string;
      isUnique: boolean;
      indexFieldMetadatas: { fieldMetadataId: string }[];
    }[];
    fields: K[];
  },
>(
  objectMetadata: T,
): K[][] => {
  const uniqueIndexes = objectMetadata.indexMetadatas.filter(
    (index) => index.isUnique,
  );

  const fieldsMapById = new Map(
    objectMetadata.fields.map((field) => [field.id, field]),
  );

  const primaryKeyConstraintField = objectMetadata.fields.find(
    (field) => field.name === 'id',
  );

  if (!isDefined(primaryKeyConstraintField)) {
    throw new Error(
      `Bidang constraint primary key tidak ditemukan untuk objek metadata ${objectMetadata.id}`,
    );
  }

  const otherUniqueConstraintsFields = uniqueIndexes.map((index) =>
    index.indexFieldMetadatas.map((field) => {
      const indexField = fieldsMapById.get(field.fieldMetadataId);

      if (!isDefined(indexField)) {
        throw new Error(
          `Bidang index tidak ditemukan untuk id bidang ${field.fieldMetadataId} pada metadata index ${index.id}`,
        );
      }

      return indexField;
    }),
  );

  return [[primaryKeyConstraintField], ...otherUniqueConstraintsFields];
};
