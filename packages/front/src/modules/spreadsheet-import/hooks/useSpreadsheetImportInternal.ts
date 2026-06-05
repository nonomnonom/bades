import { useContext } from 'react';
import { type SetRequired } from 'type-fest';

import { RsiContext } from '@/spreadsheet-import/components/ReactSpreadsheetImportContextProvider';
import { type defaultSpreadsheetImportProps } from '@/spreadsheet-import/provider/components/SpreadsheetImport';
import { type SpreadsheetImportDialogOptions } from '@/spreadsheet-import/types';

type InternalSpreadsheetImportProps = SetRequired<
  SpreadsheetImportDialogOptions,
  keyof typeof defaultSpreadsheetImportProps
>;

export const useSpreadsheetImportInternal =
  (): InternalSpreadsheetImportProps =>
    useContext(RsiContext) as InternalSpreadsheetImportProps;
