import { t } from '@lingui/core/macro';
import { type ThemeColor } from 'ui/theme';
import { UpgradeHealth } from '~/generated-admin/graphql';

type UpgradeHealthStatusBadge = {
  color: ThemeColor;
  label: string;
};

export const getUpgradeHealthStatusBadge = (
  health: UpgradeHealth | undefined,
): UpgradeHealthStatusBadge => {
  switch (health) {
    case UpgradeHealth.UP_TO_DATE:
      return { color: 'green', label: t`Mutakhir` };
    case UpgradeHealth.BEHIND:
      return { color: 'orange', label: t`Tertinggal` };
    case UpgradeHealth.FAILED:
      return { color: 'red', label: t`Gagal` };
    default:
      return { color: 'gray', label: t`Tidak diketahui` };
  }
};
