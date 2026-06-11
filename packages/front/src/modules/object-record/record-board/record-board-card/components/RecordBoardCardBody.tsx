import { isRecordFieldReadOnly } from '@/object-record/read-only/utils/isRecordFieldReadOnly';
import { RecordBoardContext } from '@/object-record/record-board/contexts/RecordBoardContext';
import { StopPropagationContainer } from '@/object-record/record-board/record-board-card/components/StopPropagationContainer';
import { RECORD_BOARD_CARD_INPUT_ID_PREFIX } from '@/object-record/record-board/record-board-card/constants/RecordBoardCardInputIdPrefix';
import { RecordBoardCardContext } from '@/object-record/record-board/record-board-card/contexts/RecordBoardCardContext';
import { recordBoardCardHoverPositionComponentState } from '@/object-record/record-board/record-board-card/states/recordBoardCardHoverPositionComponentState';
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
import { useContext, useMemo } from 'react';
import { type ObjectPermission } from '~/generated-metadata/graphql';
import { type ObjectPermissions } from 'shared/types';

type RecordBoardCardBodyFieldProps = {
  recordId: string;
  isRecordReadOnly: boolean;
  objectMetadataItemIsSystem: boolean;
  objectPermissions: ObjectPermission;
  objectPermissionsByObjectMetadataId: Record<string, ObjectPermissions & { objectMetadataId: string }>;
  recordFieldMetadataItemId: string;
  correspondingFieldDefinition: any;
  useUpdateOneRecordHook: RecordUpdateHook;
  handleMouseEnter: (index: number) => void;
  index: number;
};

const RecordBoardCardBodyField = ({
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
}: RecordBoardCardBodyFieldProps) => {
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
      anchorId: `${RECORD_BOARD_CARD_INPUT_ID_PREFIX}-${recordId}-${correspondingFieldDefinition.metadata.fieldName}`,
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
        prefix: RECORD_BOARD_CARD_INPUT_ID_PREFIX,
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
            instanceIdPrefix={RECORD_BOARD_CARD_INPUT_ID_PREFIX}
          />
        </RecordFieldComponentInstanceContext.Provider>
      </FieldContext.Provider>
    </StopPropagationContainer>
  );
};

export const RecordBoardCardBody = () => {
  const { recordId, isRecordReadOnly } = useContext(RecordBoardCardContext);

  const { updateOneRecord, objectPermissions, objectMetadataItem } =
    useContext(RecordBoardContext);

  const {
    labelIdentifierFieldMetadataItem,
    fieldDefinitionByFieldMetadataItemId,
    objectPermissionsByObjectMetadataId,
  } = useRecordIndexContextOrThrow();

  const useUpdateOneRecordHook: RecordUpdateHook = () => {
    const updateEntity = ({ variables }: RecordUpdateHookParams) => {
      updateOneRecord?.({
        idToUpdate: variables.where.id as string,
        updateOneRecordInput: variables.updateOneRecordInput,
      });
    };

    return [updateEntity, { loading: false }];
  };

  const visibleRecordFields = useAtomComponentSelectorValue(
    visibleRecordFieldsComponentSelector,
  );

  const visibleRecordFieldsExceptLabelIdentifier = visibleRecordFields.filter(
    (recordField) =>
      recordField.fieldMetadataItemId !== labelIdentifierFieldMetadataItem?.id,
  );

  const setRecordBoardCardHoverPosition = useSetAtomComponentState(
    recordBoardCardHoverPositionComponentState,
  );

  const handleMouseEnter = (index: number) => {
    setRecordBoardCardHoverPosition(index);
  };

  return (
    <RecordCardBodyContainer>
      {visibleRecordFieldsExceptLabelIdentifier.map((recordField, index) => {
        const correspondingFieldDefinition =
          fieldDefinitionByFieldMetadataItemId[recordField.fieldMetadataItemId];

        return (
          <RecordBoardCardBodyField
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
