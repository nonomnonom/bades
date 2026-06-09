import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useIsRecordFieldReadOnly } from '@/object-record/read-only/hooks/useIsRecordFieldReadOnly';
import {
  FieldContext,
  type RecordUpdateHook,
  type RecordUpdateHookParams,
} from '@/object-record/record-field/ui/contexts/FieldContext';
import { type ReactNode, useCallback, useMemo } from 'react';

export const FieldContextProvider = ({
  clearable,
  fieldMetadataName,
  fieldPosition,
  isLabelIdentifier = false,
  objectNameSingular,
  objectRecordId,
  customUseUpdateOneObjectHook,
  overridenIsFieldEmpty,
  onMouseEnter,
  anchorId,
  children,
}: {
  clearable?: boolean;
  fieldMetadataName: string;
  fieldPosition: number;
  isLabelIdentifier?: boolean;
  objectNameSingular: string;
  objectRecordId: string;
  customUseUpdateOneObjectHook?: RecordUpdateHook;
  overridenIsFieldEmpty?: boolean;
  onMouseEnter?: () => void;
  anchorId?: string;
  children: ReactNode;
}) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const fieldMetadataItem = objectMetadataItem?.fields.find(
    (field) => field.name === fieldMetadataName,
  );

  const { updateOneRecord } = useUpdateOneRecord();

  const useUpdateOneObjectMutation: RecordUpdateHook = useCallback(() => {
    const updateEntity = ({ variables }: RecordUpdateHookParams) => {
      updateOneRecord({
        objectNameSingular,
        idToUpdate: variables.where.id as string,
        updateOneRecordInput: variables.updateOneRecordInput,
      });
    };

    return [updateEntity, { loading: false }];
  }, [updateOneRecord, objectNameSingular]);

  const isRecordFieldReadOnly = useIsRecordFieldReadOnly({
    recordId: objectRecordId,
    fieldMetadataId: fieldMetadataItem?.id ?? '',
    objectMetadataId: objectMetadataItem.id,
  });

  const fieldContextValue = useMemo(
    () => ({
      recordId: objectRecordId,
      isLabelIdentifier,
      fieldDefinition: formatFieldMetadataItemAsColumnDefinition({
        field: fieldMetadataItem!,
        showLabel: true,
        position: fieldPosition,
        objectMetadataItem,
        labelWidth: 90,
      }),
      useUpdateRecord:
        customUseUpdateOneObjectHook ?? useUpdateOneObjectMutation,
      clearable,
      overridenIsFieldEmpty,
      isRecordFieldReadOnly,
      onMouseEnter,
      anchorId,
    }),
    [
      objectRecordId,
      isLabelIdentifier,
      fieldMetadataItem,
      fieldPosition,
      objectMetadataItem,
      customUseUpdateOneObjectHook,
      useUpdateOneObjectMutation,
      clearable,
      overridenIsFieldEmpty,
      isRecordFieldReadOnly,
      onMouseEnter,
      anchorId,
    ],
  );

  if (!fieldMetadataItem) {
    return null;
  }

  return (
    <FieldContext.Provider
      key={objectRecordId + fieldMetadataItem.id}
      value={fieldContextValue}
    >
      {children}
    </FieldContext.Provider>
  );
};
