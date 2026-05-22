import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { plural, t } from '@lingui/core/macro';

type SettingsAdminRetryJobsConfirmationModalProps = {
  modalInstanceId: string;
  jobCount: number;
  onConfirm: () => void;
  onClose?: () => void;
};

export const SettingsAdminRetryJobsConfirmationModal = ({
  modalInstanceId,
  jobCount,
  onConfirm,
  onClose,
}: SettingsAdminRetryJobsConfirmationModalProps) => {
  const title = plural(jobCount, {
    one: `Coba Ulang ${jobCount} Pekerjaan`,
    other: `Coba Ulang ${jobCount} Pekerjaan`,
  });

  const subtitle = plural(jobCount, {
    one: `Ini akan mencoba ulang pekerjaan yang dipilih. Pekerjaan akan dijalankan ulang dari awal.`,
    other: `Ini akan mencoba ulang pekerjaan-pekerjaan yang dipilih. Setiap pekerjaan akan dijalankan ulang dari awal.`,
  });

  return (
    <ConfirmationModal
      modalInstanceId={modalInstanceId}
      title={title}
      subtitle={subtitle}
      onConfirmClick={onConfirm}
      onClose={onClose}
      confirmButtonText={t`Coba Ulang`}
      confirmButtonAccent="blue"
    />
  );
};
