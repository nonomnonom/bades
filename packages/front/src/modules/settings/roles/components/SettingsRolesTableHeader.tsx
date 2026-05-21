import { Table } from '@/ui/layout/table/components/Table';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { Trans } from '@lingui/react/macro';

export const SettingsRolesTableHeader = () => {
  return (
    <Table>
      <TableRow
        mobileGridAutoColumns="5fr 1fr 1fr 35px"
        gridAutoColumns="332px 3fr 2fr 1fr"
      >
        <TableHeader>
          Nama
        </TableHeader>
        <TableHeader align="right">
          Ditugaskan ke
        </TableHeader>
        <TableHeader></TableHeader>
        <TableHeader></TableHeader>
      </TableRow>
    </Table>
  );
};
