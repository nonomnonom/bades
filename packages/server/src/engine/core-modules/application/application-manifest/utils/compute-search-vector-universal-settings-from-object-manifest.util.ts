import { type ObjectManifest } from 'shared/application';
import {
  type FieldMetadataUniversalSettings,
  FieldMetadataType,
} from 'shared/types';

import { getTsVectorColumnExpressionFromFields } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { isDefined, isSearchableFieldType } from 'shared/utils';

export const computeSearchVectorUniversalSettingsFromObjectManifest = ({
  objectManifest,
}: {
  objectManifest: ObjectManifest;
}): FieldMetadataUniversalSettings<FieldMetadataType.TS_VECTOR> => {
  const labelIdentifierField = objectManifest.fields.find(
    (field) =>
      field.universalIdentifier ===
      objectManifest.labelIdentifierFieldMetadataUniversalIdentifier,
  );

  if (
    !isDefined(labelIdentifierField) ||
    !isSearchableFieldType(labelIdentifierField.type)
  ) {
    return null;
  }

  return {
    asExpression: getTsVectorColumnExpressionFromFields([
      {
        name: labelIdentifierField.name,
        type: labelIdentifierField.type,
      },
    ]),
    generatedType: 'STORED',
  };
};
