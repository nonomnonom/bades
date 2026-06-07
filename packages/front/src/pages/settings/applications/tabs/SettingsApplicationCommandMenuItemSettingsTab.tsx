import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { TableSection } from '@/ui/layout/table/components/TableSection';
import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

type SettingsApplicationCommandMenuItemSettingsTabProps = {
  label: string;
  shortLabel?: string | null;
  icon?: string | null;
  isPinned: boolean;
  availabilityType: string;
  conditionalAvailabilityExpression?: string | null;
  frontComponentName?: string | null;
  universalIdentifier?: string | null;
  createdAt: string;
  updatedAt: string;
};

const StyledMonoText = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.code.font.family}, monospace;
  font-size: ${themeCssVariables.font.size.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return date.toLocaleString();
};

const GRID_TEMPLATE = '220px 1fr';

export const SettingsApplicationCommandMenuItemSettingsTab = ({
  label,
  shortLabel,
  icon,
  isPinned,
  availabilityType,
  conditionalAvailabilityExpression,
  frontComponentName,
  universalIdentifier,
  createdAt,
  updatedAt,
}: SettingsApplicationCommandMenuItemSettingsTabProps) => {
  const detailRows: { key: string; label: string; value: ReactNode }[] = [
    {
      key: 'label',
      label: `Label`,
      value: label,
    },
    {
      key: 'shortLabel',
      label: `Label singkat`,
      value: shortLabel ?? `Belum diisi`,
    },
    {
      key: 'icon',
      label: `Ikon`,
      value: icon ? <StyledMonoText>{icon}</StyledMonoText> : `Belum diisi`,
    },
    {
      key: 'isPinned',
      label: `Disematkan`,
      value: isPinned ? `Ya` : `Tidak`,
    },
    {
      key: 'availabilityType',
      label: `Ketersediaan`,
      value: <StyledMonoText>{availabilityType}</StyledMonoText>,
    },
    {
      key: 'conditionalAvailabilityExpression',
      label: `Ekspresi ketersediaan kondisional`,
      value: conditionalAvailabilityExpression ? (
        <StyledMonoText>{conditionalAvailabilityExpression}</StyledMonoText>
      ) : (
        `Belum diisi`
      ),
    },
    {
      key: 'frontComponent',
      label: `Komponen tampilan`,
      value: frontComponentName ? (
        <StyledMonoText>{frontComponentName}</StyledMonoText>
      ) : (
        `Belum diisi`
      ),
    },
    {
      key: 'universalIdentifier',
      label: `Identifier universal`,
      value: (
        <StyledMonoText>{universalIdentifier ?? `Belum diisi`}</StyledMonoText>
      ),
    },
    {
      key: 'createdAt',
      label: `Dibuat`,
      value: formatDateTime(createdAt),
    },
    {
      key: 'updatedAt',
      label: `Diperbarui`,
      value: formatDateTime(updatedAt),
    },
  ];

  return (
    <Section>
      <H2Title
        title={`Detail`}
        description={`Konfigurasi item menu perintah ini`}
      />
      <Table>
        <TableRow gridTemplateColumns={GRID_TEMPLATE}>
          <TableHeader>{`Properti`}</TableHeader>
          <TableHeader>{`Nilai`}</TableHeader>
        </TableRow>
        <TableSection title={`Item menu perintah`}>
          {detailRows.map((row) => (
            <TableRow key={row.key} gridTemplateColumns={GRID_TEMPLATE}>
              <TableCell color={themeCssVariables.font.color.secondary}>
                {row.label}
              </TableCell>
              <TableCell minWidth="0" overflow="hidden">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableSection>
      </Table>
    </Section>
  );
};
