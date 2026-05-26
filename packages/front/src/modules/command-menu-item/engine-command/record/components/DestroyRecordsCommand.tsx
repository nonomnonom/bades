import { HeadlessConfirmationModalEngineCommandEffect } from '@/command-menu-item/engine-command/components/HeadlessConfirmationModalEngineCommandEffect';
import { useHeadlessCommandContextApi } from '@/command-menu-item/engine-command/hooks/useHeadlessCommandContextApi';
import { DEFAULT_QUERY_PAGE_SIZE } from '@/object-record/constants/DefaultQueryPageSize';
import { useIncrementalDestroyManyRecords } from '@/object-record/hooks/useIncrementalDestroyManyRecords';
import { useRemoveSelectedRecordsFromRecordBoard } from '@/object-record/record-board/hooks/useRemoveSelectedRecordsFromRecordBoard';
import { useResetTableRowSelection } from '@/object-record/record-table/hooks/internal/useResetTableRowSelection';
import { t } from '~/utils/i18n/badesI18n';
import { AppPath, type RecordGqlOperationFilter } from 'shared/types';
import { isDefined } from 'shared/utils';
import { useNavigateApp } from '~/hooks/useNavigateApp';

export const DestroyRecordsCommand = () => {
  const { recordIndexId, objectMetadataItem, selectedRecords, graphqlFilter } =
    useHeadlessCommandContextApi();

  if (!isDefined(recordIndexId) || !isDefined(objectMetadataItem)) {
    throw new Error(
      'Indeks rekaman dan metadata objek diperlukan untuk menghancurkan rekaman',
    );
  }

  const isSingleRecord = selectedRecords.length === 1;

  const navigateApp = useNavigateApp();

  const { resetTableRowSelection } = useResetTableRowSelection(recordIndexId);
  const { removeSelectedRecordsFromRecordBoard } =
    useRemoveSelectedRecordsFromRecordBoard(recordIndexId);

  const noMatchFilter: RecordGqlOperationFilter = { id: { in: [] } };

  const deletedAtFilter: RecordGqlOperationFilter = {
    deletedAt: { is: 'NOT_NULL' },
  };

  const combinedFilter: RecordGqlOperationFilter = {
    ...(graphqlFilter ?? noMatchFilter),
    ...deletedAtFilter,
  };

  const { incrementalDestroyManyRecords } = useIncrementalDestroyManyRecords({
    objectNameSingular: objectMetadataItem.nameSingular,
    filter: combinedFilter,
    pageSize: DEFAULT_QUERY_PAGE_SIZE,
    delayInMsBetweenMutations: 50,
  });

  const handleExecute = async () => {
    removeSelectedRecordsFromRecordBoard();
    resetTableRowSelection();

    if (!isDefined(graphqlFilter)) {
      throw new Error('Tidak dapat menghancurkan rekaman tanpa filter yang valid');
    }

    await incrementalDestroyManyRecords();

    if (isSingleRecord) {
      navigateApp(AppPath.RecordIndexPage, {
        objectNamePlural: objectMetadataItem.namePlural,
      });
    }
  };

  const objectLabel = isSingleRecord
    ? objectMetadataItem.labelSingular
    : objectMetadataItem.labelPlural;

  const title = t`Hapus Permanen ${objectLabel}`;
  const subtitle = isSingleRecord
    ? t`Apakah Anda yakin ingin menghapus permanen ${objectMetadataItem.labelSingular} ini? Data tidak dapat dipulihkan lagi.`
    : t`Apakah Anda yakin ingin menghapus permanen ${objectMetadataItem.labelPlural} ini? Data tidak akan dapat dipulihkan lagi.`;
  const confirmButtonText = `${t`Hapus Permanen`} ${objectLabel}`;

  return (
    <HeadlessConfirmationModalEngineCommandEffect
      title={title}
      subtitle={subtitle}
      confirmButtonText={confirmButtonText}
      execute={handleExecute}
    />
  );
};
