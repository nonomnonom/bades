import { usePersistFieldFromFieldInputContext } from '@/object-record/record-field/ui/hooks/usePersistFieldFromFieldInputContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';

import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { formatFieldMetadataItemAsFieldDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsFieldDefinition';
import { recordFieldListCellEditModePositionComponentState } from '@/object-record/record-field-list/states/recordFieldListCellEditModePositionComponentState';
import {
  FieldInputEventContext,
  type FieldInputClickOutsideEvent,
  type FieldInputEvent,
} from '@/object-record/record-field/ui/contexts/FieldInputEventContext';
import { useOpenFieldInputEditMode } from '@/object-record/record-field/ui/hooks/useOpenFieldInputEditMode';
import { currentFocusIdSelector } from '@/ui/utilities/focus/states/currentFocusIdSelector';
import { useAvailableComponentInstanceId } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceId';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useStore } from 'jotai';
import { useCallback, useMemo } from 'react';

type RecordFieldListInputContextProviderProps = {
  children: React.ReactNode;
  recordId: string;
  fieldMetadataItem: FieldMetadataItem;
  objectMetadataItem: EnrichedObjectMetadataItem;
  instanceIdPrefix: string;
};

export const RecordFieldListInputContextProvider = ({
  children,
  recordId,
  fieldMetadataItem,
  objectMetadataItem,
  instanceIdPrefix,
}: RecordFieldListInputContextProviderProps) => {
  const store = useStore();
  const instanceId = useAvailableComponentInstanceId(
    RecordFieldComponentInstanceContext,
  );

  const { closeFieldInput } = useOpenFieldInputEditMode();

  const setRecordFieldListCellEditModePosition = useSetAtomComponentState(
    recordFieldListCellEditModePositionComponentState,
  );

  const fieldDefinition = formatFieldMetadataItemAsFieldDefinition({
    field: fieldMetadataItem,
    objectMetadataItem,
  });

  const closeInlineCellAndResetEditModePosition = useCallback(() => {
    setRecordFieldListCellEditModePosition(null);

    closeFieldInput({
      fieldDefinition,
      recordId,
      prefix: instanceIdPrefix,
    });
  }, [
    setRecordFieldListCellEditModePosition,
    closeFieldInput,
    fieldDefinition,
    recordId,
    instanceIdPrefix,
  ]);

  const { persistFieldFromFieldInputContext } =
    usePersistFieldFromFieldInputContext();

  const handleEnter: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      closeInlineCellAndResetEditModePosition();
    },
    [persistFieldFromFieldInputContext, closeInlineCellAndResetEditModePosition],
  );

  const handleSubmit: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      closeInlineCellAndResetEditModePosition();
    },
    [persistFieldFromFieldInputContext, closeInlineCellAndResetEditModePosition],
  );

  const handleCancel = useCallback(() => {
    closeInlineCellAndResetEditModePosition();
  }, [closeInlineCellAndResetEditModePosition]);

  const handleClickOutside: FieldInputClickOutsideEvent = useCallback(
    ({ newValue, event, skipPersist }) => {
      const currentFocusId = store.get(currentFocusIdSelector.atom);

      if (currentFocusId !== instanceId) {
        return;
      }
      event?.preventDefault();
      event?.stopImmediatePropagation();

      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      closeInlineCellAndResetEditModePosition();
    },
    [
      closeInlineCellAndResetEditModePosition,
      instanceId,
      persistFieldFromFieldInputContext,
      store,
    ],
  );

  const handleEscape: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      closeInlineCellAndResetEditModePosition();
    },
    [persistFieldFromFieldInputContext, closeInlineCellAndResetEditModePosition],
  );

  const handleTab: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      closeInlineCellAndResetEditModePosition();
    },
    [persistFieldFromFieldInputContext, closeInlineCellAndResetEditModePosition],
  );

  const handleShiftTab: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      closeInlineCellAndResetEditModePosition();
    },
    [persistFieldFromFieldInputContext, closeInlineCellAndResetEditModePosition],
  );

  const contextValue = useMemo(
    () => ({
      onCancel: handleCancel,
      onEnter: handleEnter,
      onEscape: handleEscape,
      onClickOutside: handleClickOutside,
      onShiftTab: handleShiftTab,
      onSubmit: handleSubmit,
      onTab: handleTab,
    }),
    [
      handleCancel,
      handleEnter,
      handleEscape,
      handleClickOutside,
      handleShiftTab,
      handleSubmit,
      handleTab,
    ],
  );

  return (
    <FieldInputEventContext.Provider value={contextValue}>
      {children}
    </FieldInputEventContext.Provider>
  );
};
