import { ReactSpreadsheetImportContextProvider } from '@/spreadsheet-import/components/ReactSpreadsheetImportContextProvider';
import { SpreadSheetImportModalWrapper } from '@/spreadsheet-import/components/SpreadSheetImportModalWrapper';
import { SPREADSHEET_IMPORT_MODAL_ID } from '@/spreadsheet-import/constants/SpreadsheetImportModalId';
import { SPREADSHEET_MAX_RECORD_IMPORT_CAPACITY } from '@/spreadsheet-import/constants/SpreadsheetMaxRecordImportCapacity';
import { useSpreadsheetImportInitialStep } from '@/spreadsheet-import/hooks/useSpreadsheetImportInitialStep';
import { useSpreadsheetImportInternal } from '@/spreadsheet-import/hooks/useSpreadsheetImportInternal';
import { SpreadsheetImportStepperContainer } from '@/spreadsheet-import/steps/components/SpreadsheetImportStepperContainer';
import { type SpreadsheetImportDialogOptions as SpreadsheetImportProps } from '@/spreadsheet-import/types';
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';
import { useStepBar } from '@/ui/navigation/step-bar/hooks/useStepBar';
import { useLingui } from '~/utils/i18n/badesI18n';

export const defaultSpreadsheetImportProps: Partial<SpreadsheetImportProps> = {
  autoMapHeaders: true,
  allowInvalidSubmit: true,
  autoMapDistance: 2,
  uploadStepHook: async (value) => value,
  selectHeaderStepHook: async (headerValues, data) => ({
    headerRow: headerValues,
    importedRows: data,
  }),
  matchColumnsStepHook: async (table) => table,
  dateFormat: 'yyyy-mm-dd', // ISO 8601,
  parseRaw: true,
  selectHeader: false,
  maxRecords: SPREADSHEET_MAX_RECORD_IMPORT_CAPACITY,
} as const;

export const SpreadsheetImport = (props: SpreadsheetImportProps) => {
  const mergedProps = {
    ...defaultSpreadsheetImportProps,
    ...props,
  } as SpreadsheetImportProps;

  const { enqueueDialog } = useDialogManager();

  const { initialStepState } = useSpreadsheetImportInternal();

  const { initialStep } = useSpreadsheetImportInitialStep(
    initialStepState?.type,
  );

  const { activeStep } = useStepBar({
    initialStep,
  });

  const { t } = useLingui();

  const confirmOnClose = () => {
    if (activeStep < 1) {
      mergedProps.onClose();
      return;
    }

    enqueueDialog({
      title: t`Keluar dari proses impor`,
      message: t`Yakin ingin keluar? Data yang sudah dimasukkan tidak akan disimpan.`,
      buttons: [
        { title: t`Batal` },
        {
          title: t`Keluar`,
          onClick: mergedProps.onClose,
          accent: 'danger',
          role: 'confirm',
        },
      ],
    });
  };

  return (
    <ReactSpreadsheetImportContextProvider values={mergedProps}>
      <SpreadSheetImportModalWrapper
        modalInstanceId={SPREADSHEET_IMPORT_MODAL_ID}
        onClose={confirmOnClose}
      >
        <SpreadsheetImportStepperContainer />
      </SpreadSheetImportModalWrapper>
    </ReactSpreadsheetImportContextProvider>
  );
};
