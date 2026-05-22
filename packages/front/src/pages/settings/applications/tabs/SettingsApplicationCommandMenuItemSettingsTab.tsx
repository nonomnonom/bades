import { t } from '~/utils/i18n/badesI18n';
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
      label: t`Label`,
      value: label,
    },
    {
      key: 'shortLabel',
      label: t`Label singkat`,
      value: shortLabel ?? t`Belum diisi`,
    },
    {
      key: 'icon',
      label: t`Ikon`,
      value: icon ? <StyledMonoText>{icon}</StyledMonoText> : t`Belum diisi`,
    },
    {
      key: 'isPinned',
      label: t`Disematkan`,
      value: isPinned ? t`Ya` : t`Tidak`,
    },
    {
      key: 'availabilityType',
      label: t`Ketersediaan`,
      value: <StyledMonoText>{availabilityType}</StyledMonoText>,
    },
    {
      key: 'conditionalAvailabilityExpression',
      label: t`Ekspresi ketersediaan kondisional`,
      value: conditionalAvailabilityExpression ? (
        <StyledMonoText>{conditionalAvailabilityExpression}</StyledMonoText>
      ) : (
        t`Belum diisi`
      ),
    },
    {
      key: 'frontComponent',
      label: t`Komponen tampilan`,
      value: frontComponentName ? (
        <StyledMonoText>{frontComponentName}</StyledMonoText>
      ) : (
        t`Belum diisi`
      ),
    },
    {
      key: 'universalIdentifier',
      label: t`Identifier universal`,
      value: (
        <StyledMonoText>{universalIdentifier ?? t`Belum diisi`}</StyledMonoText>
      ),
    },
    {
      key: 'createdAt',
      label: t`Dibuat`,
      value: formatDateTime(createdAt),
    },
    {
      key: 'updatedAt',
      label: t`Diperbarui`,
      value: formatDateTime(updatedAt),
    },
  ];

  return (
    <Section>
      <H2Title
        title={t`Detail`}
        description={t`Konfigurasi item menu perintah ini`}
      />
      <Table>
        <TableRow gridTemplateColumns={GRID_TEMPLATE}>
          <TableHeader>{t`Properti`}</TableHeader>
          <TableHeader>{t`Nilai`}</TableHeader>
        </TableRow>
        <TableSection title={t`Item menu perintah`}>
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
