import { usePersistFieldFromFieldInputContext } from '@/object-record/record-field/ui/hooks/usePersistFieldFromFieldInputContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';

import { recordBoardCardEditModePositionComponentState } from '@/object-record/record-board/record-board-card/states/recordBoardCardEditModePositionComponentState';
import {
  FieldInputEventContext,
  type FieldInputClickOutsideEvent,
  type FieldInputEvent,
} from '@/object-record/record-field/ui/contexts/FieldInputEventContext';
import { useInlineCell } from '@/object-record/record-inline-cell/hooks/useInlineCell';
import { currentFocusIdSelector } from '@/ui/utilities/focus/states/currentFocusIdSelector';
import { useAvailableComponentInstanceId } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceId';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useStore } from 'jotai';
import { useCallback, useMemo } from 'react';

type RecordBoardCardInputContextProviderProps = {
  children: React.ReactNode;
};

export const RecordBoardCardInputContextProvider = ({
  children,
}: RecordBoardCardInputContextProviderProps) => {
  const store = useStore();
  const { closeInlineCell } = useInlineCell();
  const setRecordBoardCardEditModePosition = useSetAtomComponentState(
    recordBoardCardEditModePositionComponentState,
  );

  const closeInlineCellAndResetEditModePosition = useCallback(() => {
    setRecordBoardCardEditModePosition(null);
    closeInlineCell();
  }, [closeInlineCell, setRecordBoardCardEditModePosition]);

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
