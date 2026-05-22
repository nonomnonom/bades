import { RECORD_GROUP_REORDER_CONFIRMATION_MODAL_ID } from '@/object-record/record-group/constants/RecordGroupReorderConfirmationModalId';
import { recordIndexRecordGroupSortComponentState } from '@/object-record/record-index/states/recordIndexRecordGroupSortComponentState';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { t } from '@lingui/core/macro';
import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type RecordGroupReorderConfirmationModalProps = {
  onConfirmClick: () => void;
};

export const RecordGroupReorderConfirmationModal = ({
  onConfirmClick,
}: RecordGroupReorderConfirmationModalProps): ReactNode => {
  const recordIndexRecordGroupSort = useAtomComponentStateValue(
    recordIndexRecordGroupSortComponentState,
  );

  return (
    <>
      {createPortal(
        <ConfirmationModal
          modalInstanceId={RECORD_GROUP_REORDER_CONFIRMATION_MODAL_ID}
          title={t`Urutan kelompok`}
          subtitle={t`Apakah Anda ingin menghapus urutan kelompok ${recordIndexRecordGroupSort}?`}
          onConfirmClick={onConfirmClick}
          confirmButtonText={t`Hapus`}
        />,
        document.body,
      )}
    </>
  );
};
