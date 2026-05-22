import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { plural, t } from '@lingui/core/macro';

type SettingsAdminDeleteJobsConfirmationModalProps = {
  modalInstanceId: string;
  jobCount: number;
  onConfirm: () => void;
  onClose?: () => void;
};

export const SettingsAdminDeleteJobsConfirmationModal = ({
  modalInstanceId,
  jobCount,
  onConfirm,
  onClose,
}: SettingsAdminDeleteJobsConfirmationModalProps) => {
  const title = plural(jobCount, {
    one: `Hapus ${jobCount} Pekerjaan`,
    other: `Hapus ${jobCount} Pekerjaan`,
  });

  const subtitle = plural(jobCount, {
    one: `Ini akan menghapus pekerjaan tersebut secara permanen dari antrian. Tindakan ini tidak dapat dibatalkan.`,
    other: `Ini akan menghapus semua pekerjaan yang dipilih secara permanen dari antrian. Tindakan ini tidak dapat dibatalkan.`,
  });

  return (
    <ConfirmationModal
      modalInstanceId={modalInstanceId}
      title={title}
      subtitle={subtitle}
      onConfirmClick={onConfirm}
      onClose={onClose}
      confirmButtonText={t`Hapus`}
      confirmButtonAccent="danger"
    />
  );
};
