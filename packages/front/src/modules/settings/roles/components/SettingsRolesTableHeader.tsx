import { Table } from '@/ui/layout/table/components/Table';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { Trans } from '~/utils/i18n/badesI18n';

export const SettingsRolesTableHeader = () => {
  return (
    <Table>
      <TableRow
        mobileGridAutoColumns="5fr 1fr 1fr 35px"
        gridAutoColumns="332px 3fr 2fr 1fr"
      >
        <TableHeader>
          <Trans>Nama</Trans>
        </TableHeader>
        <TableHeader align="right">
          <Trans>Ditugaskan ke</Trans>
        </TableHeader>
        <TableHeader></TableHeader>
        <TableHeader></TableHeader>
      </TableRow>
    </Table>
  );
};
