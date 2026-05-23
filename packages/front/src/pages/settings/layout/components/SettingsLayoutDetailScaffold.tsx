import { t } from '~/utils/i18n/badesI18n';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsSectionSkeletonLoader } from '@/settings/components/SettingsSectionSkeletonLoader';
import { Table } from '@/ui/layout/table/components/Table';
import { TableBody } from '@/ui/layout/table/components/TableBody';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

export type DetailRow = { key: string; label: string; value: ReactNode };

const StyledDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  white-space: pre-wrap;
`;

const GRID_TEMPLATE = '220px 1fr';

export const SettingsLayoutDetailScaffold = ({
  applicationId,
  applicationName,
  entityName,
  entityTypeLabel,
  categoryLabel,
  description,
  detailRows,
  isLoading,
  children,
}: {
  applicationId: string;
  applicationName: string | undefined;
  entityName: string;
  entityTypeLabel: string;
  categoryLabel: string;
  description?: string | null;
  detailRows: DetailRow[];
  isLoading: boolean;
  children?: ReactNode;
}) => {
  const trimmedDescription = description?.trim();

  const applicationContentHref = getSettingsPath(
    SettingsPath.ApplicationDetail,
    { applicationId },
    undefined,
    'content',
  );

  const breadcrumbLinks = [
    { children: t`Ruang Kerja`, href: getSettingsPath(SettingsPath.Workspace) },
    {
      children: t`Aplikasi`,
      href: getSettingsPath(SettingsPath.Applications),
    },
    { children: applicationName ?? '', href: applicationContentHref },
    { children: categoryLabel, href: applicationContentHref },
    { children: entityName },
  ];

  return (
    <SubMenuTopBarContainer title={entityName} links={breadcrumbLinks}>
      <SettingsPageContainer>
        {isLoading ? (
          <SettingsSectionSkeletonLoader />
        ) : (
          <>
            {isDefined(trimmedDescription) && trimmedDescription.length > 0 && (
              <Section>
                <H2Title
                  title={t`Tentang`}
                  description={t`Deskripsi yang disediakan oleh aplikasi`}
                />
                <StyledDescription>{trimmedDescription}</StyledDescription>
              </Section>
            )}
            <Section>
              <H2Title
                title={t`Detail`}
                description={t`Definisi ${entityTypeLabel} hanya-baca yang disertakan oleh aplikasi ini`}
              />
              <Table>
                <TableRow gridTemplateColumns={GRID_TEMPLATE}>
                  <TableHeader>{t`Properti`}</TableHeader>
                  <TableHeader>{t`Nilai`}</TableHeader>
                </TableRow>
                <TableBody>
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
                </TableBody>
              </Table>
            </Section>
            {children}
          </>
        )}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
