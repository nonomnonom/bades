import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useIsRecordFieldReadOnly } from '@/object-record/read-only/hooks/useIsRecordFieldReadOnly';
import {
  FieldContext,
  type RecordUpdateHook,
  type RecordUpdateHookParams,
} from '@/object-record/record-field/ui/contexts/FieldContext';
import { FieldFocusContextProvider } from '@/object-record/record-field/ui/contexts/FieldFocusContextProvider';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { isJunctionRelationForbidden } from '@/object-record/record-field/ui/utils/junction/isJunctionRelationForbidden';
import { RecordInlineCellAnchoredPortalContext } from '@/object-record/record-inline-cell/components/RecordInlineCellAnchoredPortalContext';
import { RecordInlineCellCloseOnSidePanelOpeningEffect } from '@/object-record/record-inline-cell/components/RecordInlineCellCloseOnSidePanelOpeningEffect';
import { getRecordFieldInputInstanceId } from '@/object-record/utils/getRecordFieldInputId';
import { useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { isDefined } from 'shared/utils';

type RecordInlineCellAnchoredPortalProps = {
  fieldMetadataItem: Pick<
    FieldMetadataItem,
    | 'id'
    | 'universalIdentifier'
    | 'name'
    | 'type'
    | 'createdAt'
    | 'updatedAt'
    | 'label'
    | 'settings'
    | 'relation'
  >;
  objectMetadataItem: EnrichedObjectMetadataItem;
  recordId: string;
  instanceIdPrefix: string;
  children: React.ReactNode;
  onCloseEditMode?: () => void;
};

export const RecordInlineCellAnchoredPortal = ({
  fieldMetadataItem,
  objectMetadataItem,
  recordId,
  instanceIdPrefix,
  children,
  onCloseEditMode,
}: RecordInlineCellAnchoredPortalProps) => {
  const fieldInstanceId = getRecordFieldInputInstanceId({
    recordId,
    fieldName: fieldMetadataItem.name,
    prefix: instanceIdPrefix,
  });

  const anchorElement = document.getElementById(fieldInstanceId);

  const isRecordFieldReadOnly = useIsRecordFieldReadOnly({
    fieldMetadataId: fieldMetadataItem.id,
    objectMetadataId: objectMetadataItem.id,
    recordId: recordId ?? '',
  });

  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const { objectMetadataItems } = useObjectMetadataItems();

  const isForbidden = isJunctionRelationForbidden({
    fieldMetadataItem,
    sourceObjectMetadataId: objectMetadataItem.id,
    objectMetadataItems,
    objectPermissionsByObjectMetadataId,
  });

  const { updateOneRecord } = useUpdateOneRecord();

  const useUpdateOneObjectRecordMutation: RecordUpdateHook = useCallback(() => {
    const updateEntity = ({ variables }: RecordUpdateHookParams) => {
      updateOneRecord({
        objectNameSingular: objectMetadataItem.nameSingular,
        idToUpdate: variables.where.id as string,
        updateOneRecordInput: variables.updateOneRecordInput,
      });
    };

    return [updateEntity, { loading: false }];
  }, [updateOneRecord, objectMetadataItem.nameSingular]);

  // Move useMemo calls BEFORE the early return to comply with Rules of Hooks
  const recordFieldComponentValue = useMemo(
    () => ({ instanceId: fieldInstanceId }),
    [fieldInstanceId],
  );

  // Only compute field context if anchor element and recordId are defined
  const fieldContextValue = useMemo(
    () => ({
      recordId,
      maxWidth: 200,
      isLabelIdentifier: false,
      fieldDefinition: formatFieldMetadataItemAsColumnDefinition({
        field: fieldMetadataItem,
        position: 0,
        objectMetadataItem,
        showLabel: true,
        labelWidth: 90,
      }),
      useUpdateRecord: useUpdateOneObjectRecordMutation,
      isDisplayModeFixHeight: true,
      isRecordFieldReadOnly,
      isForbidden,
      onCloseEditMode,
    }),
    [
      recordId,
      fieldMetadataItem,
      objectMetadataItem,
      useUpdateOneObjectRecordMutation,
      isRecordFieldReadOnly,
      isForbidden,
      onCloseEditMode,
    ],
  );

  if (!isDefined(anchorElement) || !isDefined(recordId)) {
    return null;
  }

  return (
    <FieldFocusContextProvider isFocused={true}>
      <FieldContext.Provider
        key={recordId + fieldMetadataItem.id}
        value={fieldContextValue}
      >
        <>
          {createPortal(
            <RecordFieldComponentInstanceContext.Provider
              value={recordFieldComponentValue}
            >
              <RecordInlineCellAnchoredPortalContext>
                {children}

                <RecordInlineCellCloseOnSidePanelOpeningEffect />
              </RecordInlineCellAnchoredPortalContext>
            </RecordFieldComponentInstanceContext.Provider>,
            anchorElement,
          )}
        </>
      </FieldContext.Provider>
    </FieldFocusContextProvider>
  );
};
