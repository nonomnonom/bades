import { OBJECT_LEVEL_PERMISSION_TABLE_GRID_AUTO_COLUMNS } from '@/settings/roles/role-permissions/object-level-permissions/constants/ObjectLevelPermissionTableGridAutoColumns';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { t } from '~/utils/i18n/badesI18n';

type SettingsRolePermissionsObjectLevelTableHeaderProps = {
  showPermissionsLabel?: boolean;
};

export const SettingsRolePermissionsObjectLevelTableHeader = ({
  showPermissionsLabel = true,
}: SettingsRolePermissionsObjectLevelTableHeaderProps) => (
  <TableRow gridAutoColumns={OBJECT_LEVEL_PERMISSION_TABLE_GRID_AUTO_COLUMNS}>
    <TableHeader>{t`Tingkat Objek`}</TableHeader>
    <TableHeader>{showPermissionsLabel ? t`Data` : ''}</TableHeader>
    <TableHeader>{showPermissionsLabel ? t`Lihat Kolom` : ''}</TableHeader>
    <TableHeader>{showPermissionsLabel ? t`Ubah Kolom` : ''}</TableHeader>
    <TableHeader></TableHeader>
    <TableHeader></TableHeader>
  </TableRow>
);
