/* oxlint-disable twenty/no-navigate-prefer-link */
import { RecordTableEmptyStateDisplay } from '@/object-record/record-table/empty-state/components/RecordTableEmptyStateDisplay';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'shared/types';
import { IconSettings } from 'ui/display';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const RecordTableEmptyStateRemote = () => {
  const navigate = useNavigateSettings();

  const handleButtonClick = () => {
    navigate(SettingsPath.Integrations);
  };

  return (
    <RecordTableEmptyStateDisplay
      buttonTitle={t`Buka Pengaturan`}
      subTitle={t`Jika ini tidak terduga, periksa kembali pengaturan Anda.`}
      title={t`Tidak ada data tersedia untuk tabel jarak jauh`}
      ButtonIcon={IconSettings}
      animatedPlaceholderType="noRecord"
      onClick={handleButtonClick}
    />
  );
};
