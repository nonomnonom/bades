import { FieldInput } from '@/object-record/record-field/ui/components/FieldInput';

import { usePersistFieldFromFieldInputContext } from '@/object-record/record-field/ui/hooks/usePersistFieldFromFieldInputContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';

import {
  FieldInputEventContext,
  type FieldInputClickOutsideEvent,
  type FieldInputEvent,
} from '@/object-record/record-field/ui/contexts/FieldInputEventContext';
import { useRecordTableBodyContextOrThrow } from '@/object-record/record-table/contexts/RecordTableBodyContext';
import { currentFocusIdSelector } from '@/ui/utilities/focus/states/currentFocusIdSelector';
import { useAvailableComponentInstanceId } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceId';
import { useStore } from 'jotai';
import { useCallback, useMemo } from 'react';

export const RecordTableCellFieldInput = () => {
  const { onMoveFocus, onCloseTableCell } = useRecordTableBodyContextOrThrow();
  const store = useStore();

  const instanceId = useAvailableComponentInstanceId(
    RecordFieldComponentInstanceContext,
  );

  const { persistFieldFromFieldInputContext } =
    usePersistFieldFromFieldInputContext();

  const handleEnter: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      onCloseTableCell();
      onMoveFocus('down');
    },
    [persistFieldFromFieldInputContext, onCloseTableCell, onMoveFocus],
  );

  const handleSubmit: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      onCloseTableCell();
    },
    [persistFieldFromFieldInputContext, onCloseTableCell],
  );

  const handleCancel = useCallback(() => {
    onCloseTableCell();
  }, [onCloseTableCell]);

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

      onCloseTableCell();
    },
    [onCloseTableCell, instanceId, persistFieldFromFieldInputContext, store],
  );

  const handleEscape: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      onCloseTableCell();
    },
    [persistFieldFromFieldInputContext, onCloseTableCell],
  );

  const handleTab: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      onCloseTableCell();
      onMoveFocus('right');
    },
    [persistFieldFromFieldInputContext, onCloseTableCell, onMoveFocus],
  );

  const handleShiftTab: FieldInputEvent = useCallback(
    ({ newValue, skipPersist }) => {
      if (skipPersist !== true) {
        persistFieldFromFieldInputContext(newValue);
      }

      onCloseTableCell();
      onMoveFocus('left');
    },
    [persistFieldFromFieldInputContext, onCloseTableCell, onMoveFocus],
  );

  const fieldInputEventContextValue = useMemo(
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
    <FieldInputEventContext.Provider
      value={fieldInputEventContextValue}
    >
      <FieldInput />
    </FieldInputEventContext.Provider>
  );
};
