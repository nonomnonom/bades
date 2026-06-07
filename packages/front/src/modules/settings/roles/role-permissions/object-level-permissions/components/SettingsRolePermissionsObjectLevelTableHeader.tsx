import { OBJECT_LEVEL_PERMISSION_TABLE_GRID_AUTO_COLUMNS } from '@/settings/roles/role-permissions/object-level-permissions/constants/ObjectLevelPermissionTableGridAutoColumns';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
type SettingsRolePermissionsObjectLevelTableHeaderProps = {
  showPermissionsLabel?: boolean;
};

export const SettingsRolePermissionsObjectLevelTableHeader = ({
  showPermissionsLabel = true,
}: SettingsRolePermissionsObjectLevelTableHeaderProps) => (
  <TableRow gridAutoColumns={OBJECT_LEVEL_PERMISSION_TABLE_GRID_AUTO_COLUMNS}>
    <TableHeader>{`Tingkat Objek`}</TableHeader>
    <TableHeader>{showPermissionsLabel ? `Data` : ''}</TableHeader>
    <TableHeader>{showPermissionsLabel ? `Lihat Kolom` : ''}</TableHeader>
    <TableHeader>{showPermissionsLabel ? `Ubah Kolom` : ''}</TableHeader>
    <TableHeader></TableHeader>
    <TableHeader></TableHeader>
  </TableRow>
);
