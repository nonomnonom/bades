import { HeadlessEngineCommandWrapperEffect } from '@/command-menu-item/engine-command/components/HeadlessEngineCommandWrapperEffect';
import { useHeadlessCommandContextApi } from '@/command-menu-item/engine-command/hooks/useHeadlessCommandContextApi';
import { useOpenObjectRecordsSpreadsheetImportDialog } from '@/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog';
import { isDefined } from 'shared/utils';

export const ImportRecordsNoSelectionRecordCommand = () => {
  const { objectMetadataItem } = useHeadlessCommandContextApi();

  if (!isDefined(objectMetadataItem)) {
    throw new Error('Object metadata item is required to import records');
  }

  const { openObjectRecordsSpreadsheetImportDialog } =
    useOpenObjectRecordsSpreadsheetImportDialog(
      objectMetadataItem.nameSingular,
    );

  return (
    <HeadlessEngineCommandWrapperEffect
      execute={openObjectRecordsSpreadsheetImportDialog}
    />
  );
};
