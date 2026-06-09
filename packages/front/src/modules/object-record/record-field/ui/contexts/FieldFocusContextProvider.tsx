import { useMemo, useState } from 'react';

import { FieldFocusContext } from '@/object-record/record-field/ui/contexts/FieldFocusContext';

export const FieldFocusContextProvider = ({ children }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const value = useMemo(() => ({ isFocused, setIsFocused }), [isFocused]);

  return (
    <FieldFocusContext.Provider value={value}>
      {children}
    </FieldFocusContext.Provider>
  );
};
