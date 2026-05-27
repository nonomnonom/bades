import { useContext } from 'react';

import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';

// TODO: definisikan clearable di metadata daripada di context
export const useIsFieldClearable = (): boolean => {
  const { clearable, isLabelIdentifier } = useContext(FieldContext);

  const fieldCanBeCleared = !isLabelIdentifier && clearable !== false;

  return fieldCanBeCleared;
};
