import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
export const SettingsRoleAssignmentTableHeader = () => (
  <TableRow gridAutoColumns="2fr 4fr">
    <TableHeader>{`Nama`}</TableHeader>
    <TableHeader>{`Email`}</TableHeader>
  </TableRow>
);
