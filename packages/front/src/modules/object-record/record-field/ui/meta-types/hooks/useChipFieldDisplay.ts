import { PreComputedChipGeneratorsContext } from '@/object-metadata/contexts/PreComputedChipGeneratorsContext';
import { isFieldFullName } from '@/object-record/record-field/ui/types/guards/isFieldFullName';
import { isFieldNumber } from '@/object-record/record-field/ui/types/guards/isFieldNumber';
import { isFieldText } from '@/object-record/record-field/ui/types/guards/isFieldText';
import { isFieldUuid } from '@/object-record/record-field/ui/types/guards/isFieldUuid';
import { isNonEmptyString } from '@sniptt/guards';
import { useContext } from 'react';

import { isFieldActor } from '@/object-record/record-field/ui/types/guards/isFieldActor';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { isDefined } from 'shared/utils';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';

export const useChipFieldDisplay = () => {
  const {
    fieldMetadataItemId,
    recordId,
    fieldDefinition,
    disableChipClick,
    maxWidth,
    triggerEvent,
    onRecordChipClick,
    isLabelIdentifierCompact,
  } = useContext(FieldContext);

  const { indexIdentifierUrl, labelIdentifierFieldMetadataItem } =
    useRecordIndexContextOrThrow();

  const isLabelIdentifier =
    labelIdentifierFieldMetadataItem?.id === fieldMetadataItemId;

  const labelIdentifierLink = indexIdentifierUrl(recordId);

  const { chipGeneratorPerObjectPerField } = useContext(
    PreComputedChipGeneratorsContext,
  );

  if (!isDefined(chipGeneratorPerObjectPerField)) {
    throw new Error('Generator chip per objek per field belum ditentukan');
  }

  const objectNameSingular =
    isFieldText(fieldDefinition) ||
    isFieldFullName(fieldDefinition) ||
    isFieldNumber(fieldDefinition) ||
    isFieldActor(fieldDefinition) ||
    isFieldUuid(fieldDefinition)
      ? fieldDefinition.metadata.objectMetadataNameSingular
      : undefined;

  const recordStore = useAtomFamilyStateValue(recordStoreFamilyState, recordId);

  if (!isNonEmptyString(objectNameSingular)) {
    throw new Error('Object metadata name singular bukan string non-kosong');
  }

  return {
    objectNameSingular,
    recordStore,
    isLabelIdentifier,
    labelIdentifierLink,
    disableChipClick,
    maxWidth,
    triggerEvent,
    onRecordChipClick,
    isLabelIdentifierCompact,
  };
};
