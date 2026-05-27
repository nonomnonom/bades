import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { TableSection } from '@/ui/layout/table/components/TableSection';
import { ComponentDecorator } from 'ui/testing';

const meta: Meta<typeof Table> = {
  title: 'UI/Layout/Table/Table',
  component: Table,
  decorators: [ComponentDecorator],
  argTypes: {
    as: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableRow>
        <TableHeader>Judul 1</TableHeader>
        <TableHeader>Judul 2</TableHeader>
        <TableHeader align="right">Angka</TableHeader>
      </TableRow>
      <TableSection title="Bagian 1">
        <TableRow>
          <TableCell>Sel 1</TableCell>
          <TableCell>Sel 2</TableCell>
          <TableCell align="right">3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sel 4</TableCell>
          <TableCell>Sel 5</TableCell>
          <TableCell align="right">6</TableCell>
        </TableRow>
      </TableSection>
      <TableSection title="Bagian 2">
        <TableRow>
          <TableCell>Lorem ipsum dolor sit amet</TableCell>
          <TableCell>Lorem ipsum</TableCell>
          <TableCell align="right">42</TableCell>
        </TableRow>
      </TableSection>
    </Table>
  ),
};
