import { createContext } from 'react';

import { type SpreadsheetImportDialogOptions } from '@/spreadsheet-import/types';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';

export const RsiContext = createContext({} as any);

type ReactSpreadsheetImportContextProviderProps = {
  children: React.ReactNode;
  values: SpreadsheetImportDialogOptions;
};

export const ReactSpreadsheetImportContextProvider = ({
  children,
  values,
}: ReactSpreadsheetImportContextProviderProps) => {
  if (isUndefinedOrNull(values.spreadsheetImportFields)) {
    throw new Error('Field harus diberikan ke spreadsheet-import');
  }

  return <RsiContext.Provider value={values}>{children}</RsiContext.Provider>;
};
