import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
type SettingsAdminRevokeSigningKeyConfirmationModalProps = {
  modalInstanceId: string;
  isCurrent: boolean;
  onConfirm: () => void;
  onClose?: () => void;
};

export const SettingsAdminRevokeSigningKeyConfirmationModal = ({
  modalInstanceId,
  isCurrent,
  onConfirm,
  onClose,
}: SettingsAdminRevokeSigningKeyConfirmationModalProps) => {
  const subtitle = isCurrent
    ? `Ini adalah kunci penandatanganan aktif saat ini. Mencabutnya akan membatalkan semua JWT yang ditandatangani dengannya dan pengguna mungkin perlu masuk kembali. Kunci penandatanganan baru akan dibuat secara otomatis pada permintaan berikutnya.`
    : `Mencabut kunci ini akan membatalkan semua JWT yang ditandatangani dengannya. Pengguna dengan token aktif yang ditandatangani dengan kunci ini akan keluar.`;

  return (
    <ConfirmationModal
      modalInstanceId={modalInstanceId}
      title={`Cabut kunci penandatanganan`}
      subtitle={subtitle}
      onConfirmClick={onConfirm}
      onClose={onClose}
      confirmButtonText={`Cabut`}
      confirmButtonAccent="danger"
    />
  );
};
