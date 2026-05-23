import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { t } from '~/utils/i18n/badesI18n';

export const SettingsRoleAssignmentTableHeader = () => (
  <TableRow gridAutoColumns="2fr 4fr">
    <TableHeader>{t`Nama`}</TableHeader>
    <TableHeader>{t`Email`}</TableHeader>
  </TableRow>
);
