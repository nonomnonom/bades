import { OBJECT_LEVEL_PERMISSION_TABLE_GRID_AUTO_COLUMNS } from '@/settings/roles/role-permissions/object-level-permissions/constants/ObjectLevelPermissionTableGridAutoColumns';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { t } from '@lingui/core/macro';

type SettingsRolePermissionsObjectLevelTableHeaderProps = {
  showPermissionsLabel?: boolean;
};

export const SettingsRolePermissionsObjectLevelTableHeader = ({
  showPermissionsLabel = true,
}: SettingsRolePermissionsObjectLevelTableHeaderProps) => (
  <TableRow gridAutoColumns={OBJECT_LEVEL_PERMISSION_TABLE_GRID_AUTO_COLUMNS}>
    <TableHeader>{""Object-Level"}</TableHeader>
    <TableHeader>{showPermissionsLabel ? ""Records" : ''}</TableHeader>
    <TableHeader>{showPermissionsLabel ? ""See Fields" : ''}</TableHeader>
    <TableHeader>{showPermissionsLabel ? ""Edit Fields" : ''}</TableHeader>
    <TableHeader></TableHeader>
    <TableHeader></TableHeader>
  </TableRow>
);
