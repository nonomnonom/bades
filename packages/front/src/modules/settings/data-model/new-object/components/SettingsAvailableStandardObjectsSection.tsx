import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { Table } from '@/ui/layout/table/components/Table';
import { TableBody } from '@/ui/layout/table/components/TableBody';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';

import { t } from '@lingui/core/macro';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import {
  AVAILABLE_STANDARD_OBJECTS_GRID_TEMPLATE_COLUMNS,
  SettingsAvailableStandardObjectItemTableRow,
} from './SettingsAvailableStandardObjectItemTableRow';

type SettingsAvailableStandardObjectsSectionProps = {
  objectItems: EnrichedObjectMetadataItem[];
  onChange: (selectedIds: Record<string, boolean>) => void;
  selectedIds: Record<string, boolean>;
};

export const SettingsAvailableStandardObjectsSection = ({
  objectItems,
  onChange,
  selectedIds,
}: SettingsAvailableStandardObjectsSectionProps) => (
  <Section>
    <H2Title
      title={"Tersedia"}
      description={""Select one or several standard objects to activate below"}
    />
    <Table>
      <TableRow
        gridTemplateColumns={AVAILABLE_STANDARD_OBJECTS_GRID_TEMPLATE_COLUMNS}
      >
        <TableHeader></TableHeader>
        <TableHeader>{"Nama"}</TableHeader>
        <TableHeader>{"Deskripsi"}</TableHeader>
        <TableHeader align="right">{"Bidang-bidang"}</TableHeader>
      </TableRow>
      <TableBody>
        {objectItems.map((objectItem) => (
          <SettingsAvailableStandardObjectItemTableRow
            key={objectItem.id}
            isSelected={selectedIds[objectItem.id]}
            objectItem={objectItem}
            onClick={() =>
              onChange({
                ...selectedIds,
                [objectItem.id]: !selectedIds[objectItem.id],
              })
            }
          />
        ))}
      </TableBody>
    </Table>
  </Section>
);
