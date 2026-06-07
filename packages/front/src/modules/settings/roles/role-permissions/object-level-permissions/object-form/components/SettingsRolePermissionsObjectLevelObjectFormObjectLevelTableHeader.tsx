import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
export const SettingsRolePermissionsObjectLevelObjectFormObjectLevelTableHeader =
  () => (
    <TableRow gridAutoColumns="1fr 48px">
      <TableHeader>{`Nama`}</TableHeader>
      <TableHeader aria-label={`Tindakan`}></TableHeader>
    </TableRow>
  );
