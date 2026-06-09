import { compositeTypeDefinitions } from 'shared/types';

import { computeCompositeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { isCompositeFieldMetadataType } from 'src/engine/metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util';
import { type FieldMetadataSeed } from 'src/engine/workspace-manager/sid-standard-seed/constants/types/field-metadata-seed.type';

export const ACTOR_AUDIT_SEED_COLUMNS = [
  'createdBySource',
  'createdByName',
  'updatedBySource',
  'updatedByName',
] as const;

export const expandFieldSeedToPgColumns = (
  fieldSeed: FieldMetadataSeed,
): string[] => {
  if (isCompositeFieldMetadataType(fieldSeed.type)) {
    const compositeType = compositeTypeDefinitions.get(fieldSeed.type);

    if (!compositeType) {
      throw new Error(
        `Composite type definition tidak ditemukan untuk field '${fieldSeed.name}' (${fieldSeed.type})`,
      );
    }

    return compositeType.properties.map((compositeProperty) =>
      computeCompositeColumnName(fieldSeed.name, compositeProperty),
    );
  }

  return [fieldSeed.name];
};

export const buildSidStandardSeedColumns = ({
  fieldSeeds,
  extraColumns = [],
  includeName = true,
}: {
  fieldSeeds: FieldMetadataSeed[];
  extraColumns?: string[];
  includeName?: boolean;
}): string[] => {
  const customColumns = fieldSeeds.flatMap((fieldSeed) =>
    expandFieldSeedToPgColumns(fieldSeed),
  );

  return [
    'id',
    ...(includeName ? ['name'] : []),
    ...customColumns,
    ...extraColumns,
    'position',
    ...ACTOR_AUDIT_SEED_COLUMNS,
  ];
};

export const buildRelationJoinColumnName = (fieldName: string): string =>
  `${fieldName}Id`;
