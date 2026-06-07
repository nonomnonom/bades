import { useSpreadsheetImportInitialStep } from '@/spreadsheet-import/hooks/useSpreadsheetImportInitialStep';
import { useSpreadsheetImportInternal } from '@/spreadsheet-import/hooks/useSpreadsheetImportInternal';

import { StepBar } from '@/ui/navigation/step-bar/components/StepBar';
import { useStepBar } from '@/ui/navigation/step-bar/hooks/useStepBar';

import { spreadsheetImportDialogState } from '@/spreadsheet-import/states/spreadsheetImportDialogState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { themeCssVariables } from 'ui/theme-constants';
import { ModalHeader } from 'ui/layout';
import { SpreadsheetImportStepper } from './SpreadsheetImportStepper';

export const SpreadsheetImportStepperContainer = () => {
  const spreadsheetImportDialog = useAtomStateValue(
    spreadsheetImportDialogState,
  );

  const stepTitles = {
    uploadStep: `Unggah Berkas`,
    matchColumnsStep: `Cocokkan Kolom`,
    validationStep: `Validasi Data`,
  };

  const { initialStepState } = useSpreadsheetImportInternal();

  const { steps, initialStep } = useSpreadsheetImportInitialStep(
    initialStepState?.type,
  );

  const { nextStep, prevStep, activeStep } = useStepBar({
    initialStep,
  });

  return (
    <>
      <ModalHeader
        hasBorderBottom
        paddingHorizontal={30}
        backgroundColor={themeCssVariables.background.secondary}
      >
        {spreadsheetImportDialog.isStepBarVisible && (
          <StepBar activeStep={activeStep}>
            {steps.map((key) => (
              <StepBar.Step
                activeStep={activeStep}
                label={stepTitles[key]}
                key={key}
              />
            ))}
          </StepBar>
        )}
      </ModalHeader>
      <SpreadsheetImportStepper nextStep={nextStep} prevStep={prevStep} />
    </>
  );
};
