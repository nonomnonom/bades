import { RECORD_INDEX_REMOVE_SORTING_MODAL_ID } from '@/object-record/record-index/constants/RecordIndexRemoveSortingModalId';
import { useRemoveRecordSort } from '@/object-record/record-sort/hooks/useRemoveRecordSort';
import { currentRecordSortsComponentState } from '@/object-record/record-sort/states/currentRecordSortsComponentState';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';

export const RecordIndexRemoveSortingModal = () => {
  const currentRecordSorts = useAtomComponentStateValue(
    currentRecordSortsComponentState,
  );

  const fieldMetadataIds = currentRecordSorts.map(
    (viewSort) => viewSort.fieldMetadataId,
  );

  const { removeRecordSort } = useRemoveRecordSort();

  const handleRemoveClick = () => {
    fieldMetadataIds.forEach((id) => {
      removeRecordSort(id);
    });
  };

  return (
    <ConfirmationModal
      modalInstanceId={RECORD_INDEX_REMOVE_SORTING_MODAL_ID}
      title={`Hapus pengurutan?`}
      subtitle={`Langkah ini diperlukan untuk mengaktifkan pengurutan baris secara manual.`}
      onConfirmClick={handleRemoveClick}
      confirmButtonText={`Hapus Pengurutan`}
    />
  );
};
