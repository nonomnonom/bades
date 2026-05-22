import { settingsDraftRoleFamilyState } from '@/settings/roles/states/settingsDraftRoleFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { t } from '~/utils/i18n/badesI18n';

type SettingsRoleSettingsDeleteRoleConfirmationModalSubtitleProps = {
  roleId: string;
};

export const SettingsRoleSettingsDeleteRoleConfirmationModalSubtitle = ({
  roleId,
}: SettingsRoleSettingsDeleteRoleConfirmationModalSubtitleProps) => {
  const settingsDraftRole = useAtomFamilyStateValue(
    settingsDraftRoleFamilyState,
    roleId,
  );
  const roleName = settingsDraftRole.label;

  return (
    <>{t`Konfirmasi penghapusan peran ${roleName}? Tindakan ini tidak dapat dibatalkan. Semua anggota akan dialihkan ke peran default.`}</>
  );
};
