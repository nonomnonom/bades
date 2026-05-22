import { useLingui } from '~/utils/i18n/badesI18n';
import { SettingsEmptyPlaceholder } from '@/settings/components/SettingsEmptyPlaceholder';
import {
  StyledActionTableCell,
  StyledNameTableCell,
} from '@/settings/data-model/object-details/components/SettingsObjectItemTableRowStyledComponents';
import { SettingsPublicDomainsListCard } from '@/settings/domains/components/SettingsPublicDomainsListCard';
import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';
import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { useContext, useMemo, useState } from 'react';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';
import { FeatureFlagKey, SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import {
  CommandBlock,
  H2Title,
  IconArrowUpRight,
  IconChevronRight,
  IconCopy,
  InlineBanner,
  OverflowingTextWithTooltip,
} from 'ui/display';
import { Button, SearchInput } from 'ui/input';
import { Section } from 'ui/layout';
import {
  type ApplicationRegistrationFragmentFragment,
  FindManyApplicationRegistrationsDocument,
} from '~/generated-metadata/graphql';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';
import { useMarketplaceApps } from '~/modules/marketplace/hooks/useMarketplaceApps';
import {
  APPLICATION_TABLE_ROW_GRID_TEMPLATE_COLUMNS,
  SettingsApplicationTableRow,
} from '~/pages/settings/applications/components/SettingsApplicationTableRow';
import { getApplicationDescriptionSummary } from '~/pages/settings/applications/utils/getApplicationDescriptionSummary';
import { ApplicationDisplay } from '@/applications/components/ApplicationDisplay';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { SettingsEmailingDomains } from '~/pages/settings/emailing-domains/SettingsEmailingDomains';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${themeCssVariables.spacing[2]};
`;

const StyledSearchInputContainer = styled.div`
  padding-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledTableRowsContainer = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  padding: ${themeCssVariables.spacing[2]} 0;
`;

const NPM_PACKAGES_GRID_COLUMNS = '200px 1fr 36px';

export const SettingsApplicationsDeveloperTab = () => {
  const { t } = useLingui();
  const { theme } = useContext(ThemeContext);

  const [displayNotVettedApps, setDisplayNotVettedApps] = useState(false);

  const { copyToClipboard } = useCopyToClipboard();

  const { data } = useQuery(FindManyApplicationRegistrationsDocument);

  const isMarketplaceSettingTabVisible = useIsFeatureEnabled(
    FeatureFlagKey.IS_MARKETPLACE_SETTING_TAB_VISIBLE,
  );

  const isPublicDomainEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_PUBLIC_DOMAIN_ENABLED,
  );
  const isEmailingDomainEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_EMAILING_DOMAIN_ENABLED,
  );

  const [marketplaceAppSearchTerm, setMarketplaceAppSearchTerm] = useState('');

  const [myAppsSearchTerm, setMyAppsSearchTerm] = useState('');

  const { data: marketplaceApps } = useMarketplaceApps();

  const filteredMarketplaceApps = useMemo(() => {
    if (!marketplaceAppSearchTerm) {
      return marketplaceApps;
    }

    const lowerSearch = marketplaceAppSearchTerm.toLowerCase();

    return marketplaceApps.filter(
      (application) =>
        application.name.toLowerCase().includes(lowerSearch) ||
        application.description.toLowerCase().includes(lowerSearch),
    );
  }, [marketplaceApps, marketplaceAppSearchTerm]);

  const registrations: ApplicationRegistrationFragmentFragment[] =
    data?.findManyApplicationRegistrations ?? [];

  const createCommands = [
    // oxlint-disable-next-line lingui/no-unlocalized-strings
    'npx create-bades-app@latest my-bades-app',
    // oxlint-disable-next-line lingui/no-unlocalized-strings
    'cd my-bades-app',
  ];

  const createCopyButton = (
    <Button
      onClick={() => {
        copyToClipboard(
          createCommands.join('\n'),
          t`Perintah disalin ke clipboard`,
        );
      }}
      ariaLabel={t`Salin perintah`}
      Icon={IconCopy}
    />
  );

  const getRegistrationLink = (
    registration: ApplicationRegistrationFragmentFragment,
  ) =>
    getSettingsPath(SettingsPath.ApplicationRegistrationDetail, {
      applicationRegistrationId: registration.id,
    });

  return (
    <>
      <Section>
        <H2Title
          title={t`Buat aplikasi baru`}
          description={t`Buat aplikasi privat atau distribusikan ke tim Bades`}
        />
        <CommandBlock commands={createCommands} button={createCopyButton} />
        <StyledButtonContainer>
          <Button
            Icon={IconArrowUpRight}
            variant={'secondary'}
            size={'small'}
            title={t`Baca dokumentasi`}
            onClick={() =>
              window.open(
                getDocumentationUrl({
                  path: '/developers/extend/apps/getting-started',
                }),
                '_blank',
              )
            }
          />
        </StyledButtonContainer>
      </Section>

      {registrations.length > 0 && (
        <Section>
          <H2Title
            title={t`Aplikasi saya`}
            description={t`Aplikasi yang Anda kembangkan`}
          />
          <StyledSearchInputContainer>
            <SearchInput
              placeholder={t`Cari aplikasi`}
              value={myAppsSearchTerm}
              onChange={setMyAppsSearchTerm}
            />
          </StyledSearchInputContainer>
          <Table>
            <TableRow
              gridTemplateColumns={APPLICATION_TABLE_ROW_GRID_TEMPLATE_COLUMNS}
            >
              <TableHeader> {t`Nama`}</TableHeader>
              <TableHeader>{''}</TableHeader>
              <TableHeader>{''}</TableHeader>
              <TableHeader />
            </TableRow>
            <StyledTableRowsContainer>
              {registrations.map((registration) => {
                return (
                  <SettingsApplicationTableRow
                    key={registration.id}
                    application={registration}
                    action={
                      <IconChevronRight
                        size={theme.icon.size.md}
                        stroke={theme.icon.stroke.sm}
                        color={theme.font.color.light}
                      />
                    }
                    link={getRegistrationLink(registration)}
                  />
                );
              })}
            </StyledTableRowsContainer>
          </Table>
        </Section>
      )}

      {isEmailingDomainEnabled && (
        <Section>
          <H2Title
            title={t`Domain Pengiriman Email`}
            description={t`Konfigurasi dan verifikasi domain untuk pengiriman email dari ruang kerja ini.`}
          />
          <SettingsEmailingDomains />
        </Section>
      )}

      {isPublicDomainEnabled && (
        <Section>
          <H2Title
            title={t`Domain Publik`}
            description={t`Sediakan lingkungan hosting yang lengkap dan aman pada domain ini. Ikat domain ke aplikasi tertentu untuk mengekspos hanya rute HTTP aplikasi tersebut.`}
          />
          <SettingsPublicDomainsListCard />
        </Section>
      )}

      {!isMarketplaceSettingTabVisible && (
        <Section>
          <H2Title
            title={t`Paket NPM`}
            description={t`Aplikasi dari pengembang lain yang dipublikasikan di npm`}
          />
          <InlineBanner
            color={'danger'}
            message={t`Aplikasi ini belum diverifikasi. Gunakan dengan risiko sendiri.`}
            button={{
              title: t`Akses`,
              hidden: displayNotVettedApps,
              onClick: () => setDisplayNotVettedApps(true),
            }}
          />
          {displayNotVettedApps && (
            <>
              <StyledSearchInputContainer>
                <SearchInput
                  placeholder={t`Cari aplikasi`}
                  value={marketplaceAppSearchTerm}
                  onChange={setMarketplaceAppSearchTerm}
                />
              </StyledSearchInputContainer>
              {filteredMarketplaceApps.length === 0 ? (
                <SettingsEmptyPlaceholder>{t`Tidak ada aplikasi yang ditemukan`}</SettingsEmptyPlaceholder>
              ) : (
                <Table>
                  <TableRow gridAutoColumns={NPM_PACKAGES_GRID_COLUMNS}>
                    <TableHeader>{t`Nama`}</TableHeader>
                    <TableHeader>{t`Deskripsi`}</TableHeader>
                    <TableHeader />
                  </TableRow>
                  <StyledTableRowsContainer>
                    {filteredMarketplaceApps.map((application) => (
                      <TableRow
                        key={application.id}
                        gridAutoColumns={NPM_PACKAGES_GRID_COLUMNS}
                        to={getSettingsPath(
                          SettingsPath.AvailableApplicationDetail,
                          {
                            availableApplicationId: application.id,
                          },
                        )}
                      >
                        <StyledNameTableCell>
                          <ApplicationDisplay application={application} />
                        </StyledNameTableCell>
                        <TableCell
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          <OverflowingTextWithTooltip
                            text={getApplicationDescriptionSummary(
                              application.description,
                            )}
                          />
                        </TableCell>
                        <StyledActionTableCell>
                          <IconChevronRight
                            size={theme.icon.size.md}
                            stroke={theme.icon.stroke.sm}
                            color={theme.font.color.light}
                          />
                        </StyledActionTableCell>
                      </TableRow>
                    ))}
                  </StyledTableRowsContainer>
                </Table>
              )}
            </>
          )}
        </Section>
      )}
    </>
  );
};
