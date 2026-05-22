import { useLingui } from '~/utils/i18n/badesI18n';
import { useObjectLabel } from '@/object-metadata/hooks/useObjectLabel';
import { useCheckIsSoftDeleteFilter } from '@/object-record/record-filter/hooks/useCheckIsSoftDeleteFilter';
import { useRemoveRecordFilter } from '@/object-record/record-filter/hooks/useRemoveRecordFilter';
import { useHandleToggleTrashColumnFilter } from '@/object-record/record-index/hooks/useHandleToggleTrashColumnFilter';
import { useRecordTableContextOrThrow } from '@/object-record/record-table/contexts/RecordTableContext';
import { RecordTableEmptyStateDisplay } from '@/object-record/record-table/empty-state/components/RecordTableEmptyStateDisplay';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';

import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { isDefined } from 'shared/utils';
import { IconFilterOff } from 'ui/display';

export const RecordTableEmptyStateSoftDelete = () => {
  const { t } = useLingui();

  const { objectMetadataItem, objectNameSingular, recordTableId } =
    useRecordTableContextOrThrow();

  const currentRecordFilters = useAtomComponentStateValue(
    currentRecordFiltersComponentState,
  );

  const { toggleSoftDeleteFilterState } = useHandleToggleTrashColumnFilter({
    objectNameSingular,
    viewBarId: recordTableId,
  });

  const { removeRecordFilter } = useRemoveRecordFilter();

  const { isRecordFilterAboutSoftDelete } = useCheckIsSoftDeleteFilter();

  const handleButtonClick = async () => {
    const deletedFilter = currentRecordFilters.find(
      isRecordFilterAboutSoftDelete,
    );

    if (!isDefined(deletedFilter)) {
      throw new Error('Deleted filter not found');
    }

    removeRecordFilter({ recordFilterId: deletedFilter.id });

    toggleSoftDeleteFilterState(false);
  };

  const objectLabelSingular = useObjectLabel(objectMetadataItem);

  return (
    <RecordTableEmptyStateDisplay
      buttonTitle={t`Hapus filter Dihapus`}
      subTitle={t`Tidak ada data yang dihapus sesuai dengan kriteria filter.`}
      title={t`Tidak ada ${objectLabelSingular} yang dihapus ditemukan`}
      ButtonIcon={IconFilterOff}
      animatedPlaceholderType="noDeletedRecord"
      onClick={handleButtonClick}
    />
  );
};
