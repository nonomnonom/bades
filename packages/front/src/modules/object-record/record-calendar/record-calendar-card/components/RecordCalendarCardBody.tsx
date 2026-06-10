import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { isRecordFieldReadOnly } from '@/object-record/read-only/utils/isRecordFieldReadOnly';
import { StopPropagationContainer } from '@/object-record/record-board/record-board-card/components/StopPropagationContainer';
import { useRecordCalendarContextOrThrow } from '@/object-record/record-calendar/contexts/RecordCalendarContext';
import { RECORD_CALENDAR_CARD_INPUT_ID_PREFIX } from '@/object-record/record-calendar/record-calendar-card/constants/RecordCalendarCardInputIdPrefix';
import { recordCalendarCardHoverPositionComponentState } from '@/object-record/record-calendar/record-calendar-card/states/recordCalendarCardHoverPositionComponentState';
import { RecordCardBodyContainer } from '@/object-record/record-card/components/RecordCardBodyContainer';
import { visibleRecordFieldsComponentSelector } from '@/object-record/record-field/states/visibleRecordFieldsComponentSelector';
import {
  FieldContext,
  type RecordUpdateHook,
  type RecordUpdateHookParams,
} from '@/object-record/record-field/ui/contexts/FieldContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { RecordInlineCell } from '@/object-record/record-inline-cell/components/RecordInlineCell';
import { getRecordFieldInputInstanceId } from '@/object-record/utils/getRecordFieldInputId';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useMemo } from 'react';
import { themeCssVariables } from 'ui/theme-constants';
import { type ObjectPermission } from '~/generated-metadata/graphql';

type RecordCalendarCardBodyProps = {
  recordId: string;
  isRecordReadOnly: boolean;
};

type RecordCalendarCardBodyFieldProps = {
  recordId: string;
  isRecordReadOnly: boolean;
  objectMetadataItemIsSystem: boolean;
  objectPermissions: ObjectPermission;
  objectPermissionsByObjectMetadataId: Record<string, ObjectPermission>;
  recordFieldMetadataItemId: string;
  correspondingFieldDefinition: any;
  useUpdateOneRecordHook: RecordUpdateHook;
  handleMouseEnter: (index: number) => void;
  index: number;
};

const RecordCalendarCardBodyField = ({
  recordId,
  isRecordReadOnly,
  objectMetadataItemIsSystem,
  objectPermissions,
  objectPermissionsByObjectMetadataId,
  recordFieldMetadataItemId,
  correspondingFieldDefinition,
  useUpdateOneRecordHook,
  handleMouseEnter,
  index,
}: RecordCalendarCardBodyFieldProps) => {
  const fieldContextValue = useMemo(
    () => ({
      recordId,
      maxWidth: 156,
      isLabelIdentifier: false,
      isRecordFieldReadOnly: isRecordFieldReadOnly({
        isRecordReadOnly,
        isSystemObject: objectMetadataItemIsSystem,
        objectPermissions,
        fieldMetadataItem: {
          id: recordFieldMetadataItemId,
          isUIReadOnly:
            correspondingFieldDefinition.metadata.isUIReadOnly ?? false,
          isCustom: correspondingFieldDefinition.metadata.isCustom ?? false,
        },
        fieldDefinition: correspondingFieldDefinition,
        objectPermissionsByObjectMetadataId,
      }),
      fieldDefinition: correspondingFieldDefinition,
      useUpdateRecord: useUpdateOneRecordHook,
      isDisplayModeFixHeight: true,
      triggerEvent: 'CLICK' as const,
      anchorId: `${RECORD_CALENDAR_CARD_INPUT_ID_PREFIX}-${recordId}-${correspondingFieldDefinition.metadata.fieldName}`,
      onMouseEnter: () => handleMouseEnter(index),
    }),
    [
      recordId,
      isRecordReadOnly,
      objectMetadataItemIsSystem,
      objectPermissions,
      objectPermissionsByObjectMetadataId,
      recordFieldMetadataItemId,
      correspondingFieldDefinition,
      useUpdateOneRecordHook,
      handleMouseEnter,
      index,
    ],
  );

  const instanceContextValue = useMemo(
    () => ({
      instanceId: getRecordFieldInputInstanceId({
        recordId,
        fieldName: correspondingFieldDefinition.metadata.fieldName,
        prefix: RECORD_CALENDAR_CARD_INPUT_ID_PREFIX,
      }),
    }),
    [recordId, correspondingFieldDefinition],
  );

  return (
    <StopPropagationContainer>
      <FieldContext.Provider value={fieldContextValue}>
        <RecordFieldComponentInstanceContext.Provider
          value={instanceContextValue}
        >
          <RecordInlineCell
            instanceIdPrefix={RECORD_CALENDAR_CARD_INPUT_ID_PREFIX}
          />
        </RecordFieldComponentInstanceContext.Provider>
      </FieldContext.Provider>
    </StopPropagationContainer>
  );
};

export const RecordCalendarCardBody = ({
  recordId,
  isRecordReadOnly,
}: RecordCalendarCardBodyProps) => {
  const { objectPermissions, objectMetadataItem } =
    useRecordCalendarContextOrThrow();

  const { updateOneRecord } = useUpdateOneRecord();

  const useUpdateOneRecordHook: RecordUpdateHook = () => {
    const updateEntity = ({ variables }: RecordUpdateHookParams) => {
      updateOneRecord({
        objectNameSingular: objectMetadataItem.nameSingular,
        idToUpdate: variables.where.id as string,
        updateOneRecordInput: variables.updateOneRecordInput,
      });
    };

    return [updateEntity, { loading: false }];
  };

  const {
    labelIdentifierFieldMetadataItem,
    fieldDefinitionByFieldMetadataItemId,
    objectPermissionsByObjectMetadataId,
  } = useRecordIndexContextOrThrow();

  const visibleRecordFields = useAtomComponentSelectorValue(
    visibleRecordFieldsComponentSelector,
  );

  const visibleRecordFieldsExceptLabelIdentifier = visibleRecordFields.filter(
    (recordField) =>
      recordField.fieldMetadataItemId !== labelIdentifierFieldMetadataItem?.id,
  );

  const setRecordCalendarCardHoverPosition = useSetAtomComponentState(
    recordCalendarCardHoverPositionComponentState,
  );

  const handleMouseEnter = (index: number) => {
    setRecordCalendarCardHoverPosition(index);
  };

  return (
    <RecordCardBodyContainer padding={themeCssVariables.spacing[1]}>
      {visibleRecordFieldsExceptLabelIdentifier.map((recordField, index) => {
        const correspondingFieldDefinition =
          fieldDefinitionByFieldMetadataItemId[recordField.fieldMetadataItemId];

        return (
          <RecordCalendarCardBodyField
            key={recordField.fieldMetadataItemId}
            recordId={recordId}
            isRecordReadOnly={isRecordReadOnly}
            objectMetadataItemIsSystem={objectMetadataItem.isSystem}
            objectPermissions={objectPermissions}
            objectPermissionsByObjectMetadataId={
              objectPermissionsByObjectMetadataId
            }
            recordFieldMetadataItemId={recordField.fieldMetadataItemId}
            correspondingFieldDefinition={correspondingFieldDefinition}
            useUpdateOneRecordHook={useUpdateOneRecordHook}
            handleMouseEnter={handleMouseEnter}
            index={index}
          />
        );
      })}
    </RecordCardBodyContainer>
  );
};
