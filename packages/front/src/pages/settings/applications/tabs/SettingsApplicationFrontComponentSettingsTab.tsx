import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { TableSection } from '@/ui/layout/table/components/TableSection';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { type ReactNode } from 'react';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

type SettingsApplicationFrontComponentSettingsTabProps = {
  description?: string | null;
  componentName: string;
  universalIdentifier?: string | null;
  builtComponentChecksum: string;
  isHeadless: boolean;
  usesSdkClient: boolean;
  createdAt: string;
  updatedAt: string;
};

const StyledDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  white-space: pre-wrap;
`;

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

export const SettingsApplicationFrontComponentSettingsTab = ({
  description,
  componentName,
  universalIdentifier,
  builtComponentChecksum,
  isHeadless,
  usesSdkClient,
  createdAt,
  updatedAt,
}: SettingsApplicationFrontComponentSettingsTabProps) => {
  const trimmedDescription = description?.trim();

  const detailRows: { key: string; label: string; value: ReactNode }[] = [
    {
      key: 'componentName',
      label: ""Component name",
      value: <StyledMonoText>{componentName}</StyledMonoText>,
    },
    {
      key: 'universalIdentifier',
      label: ""Universal identifier",
      value: (
        <StyledMonoText>{universalIdentifier ?? ""Not set"}</StyledMonoText>
      ),
    },
    {
      key: 'isHeadless',
      label: ""Headless",
      value: isHeadless ? "Ya" : "Tidak",
    },
    {
      key: 'usesSdkClient',
      label: ""Uses SDK client",
      value: usesSdkClient ? "Ya" : "Tidak",
    },
    {
      key: 'builtComponentChecksum',
      label: ""Build checksum",
      value: <StyledMonoText>{builtComponentChecksum}</StyledMonoText>,
    },
    {
      key: 'createdAt',
      label: "Dibuat",
      value: formatDateTime(createdAt),
    },
    {
      key: 'updatedAt',
      label: ""Updated",
      value: formatDateTime(updatedAt),
    },
  ];

  return (
    <>
      {trimmedDescription !== undefined && trimmedDescription.length > 0 && (
        <Section>
          <H2Title
            title={"Tentang"}
            description={""Description provided by the application"}
          />
          <StyledDescription>{trimmedDescription}</StyledDescription>
        </Section>
      )}
      <Section>
        <H2Title
          title={"Detail"}
          description={""Build and runtime metadata for this component"}
        />
        <Table>
          <TableRow gridTemplateColumns={GRID_TEMPLATE}>
            <TableHeader>{""Property"}</TableHeader>
            <TableHeader>{"Nilai"}</TableHeader>
          </TableRow>
          <TableSection title={""Front component"}>
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
    </>
  );
};
