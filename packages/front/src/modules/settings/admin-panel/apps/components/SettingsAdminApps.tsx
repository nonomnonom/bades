import { AppChip } from '@/applications/components/AppChip';
import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { Table } = '@/ui/layout/table/components/Table';
import { TableBody } = '@/ui/layout/table/components/TableBody';
import { TableCell } = '@/ui/layout/table/components/TableCell';
import { TableHeader } = '@/ui/layout/table/components/TableHeader';
import { TableRow } = '@/ui/layout/table/components/TableRow';
import { useQuery } = '@apollo/client/react';
import { styled } = '@linaria/react';
import { type ReactNode, useContext, useState } = 'react';
import { assertUnreachable, getSettingsPath } = 'shared/utils';
import { SettingsPath } = 'shared/types';
import { H2Title, IconChevronRight, IconPinned } = 'ui/display';
import { SearchInput } = 'ui/input';
import { Section } = 'ui/layout';
import { MenuItemToggle } = 'ui/navigation';
import { ThemeContext, themeCssVariables } = 'ui/theme-constants';
import { Tag } = 'ui/components';
import {
  type ApplicationRegistrationFragmentFragment,
  ApplicationRegistrationSourceType,
  FindAllApplicationRegistrationsDocument,
} from '~/generated-admin/graphql';

const StyledTableContainer = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  margin-top: ${themeCssVariables.spacing[3]};
`;

const TABLE_GRID = '1fr 100px 100px 100px 40px';
const TABLE_GRID_MOBILE = '3fr 3fr 1fr 1fr 40px';

export const SettingsAdminApps = () => {
  const apolloAdminClient = useApolloAdminClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreInstalledOnly, setShowPreInstalledOnly] = useState(false);

  const { data } = useQuery(FindAllApplicationRegistrationsDocument, {
    client: apolloAdminClient,
  });

  const registrations = data?.findAllApplicationRegistrations ?? [];

  const query = searchQuery.trim().toLowerCase();

  const filtered = registrations
    .filter((registration) => {
      if (showPreInstalledOnly && !registration.isPreInstalled) {
        return false;
      }

      if (query.length === 0) {
        return true;
      }

      return (
        registration.name.toLowerCase().includes(query) ||
        (registration.sourcePackage ?? '').toLowerCase().includes(query) ||
        registration.universalIdentifier.toLowerCase().includes(query)
      );
    })
    .toSorted((a, b) => Number(a.isConfigured) - Number(b.isConfigured));

  const getFormattedSource = (
    registration: ApplicationRegistrationFragmentFragment,
  ) => {
    switch (registration.sourceType) {
      case ApplicationRegistrationSourceType.TARBALL: {
        return 'Tarball';
      }
      case ApplicationRegistrationSourceType.NPM: {
        return 'NPM';
      }
      case ApplicationRegistrationSourceType.OAUTH_ONLY: {
        return 'OAuth';
      }
      case ApplicationRegistrationSourceType.LOCAL: {
        return 'Local';
      }
      default:
        return assertUnreachable(registration.sourceType);
    }
  };

  return (
    <Section>
       <H2Title
         title="Semua Registrasi Aplikasi"
         description="Semua registrasi aplikasi di seluruh platform, termasuk aplikasi yang tidak terhubung"
       />
       <SearchInput
         placeholder="Cari registrasi..."
         value={searchQuery}
         onChange={setSearchQuery}
         filterDropdown={(filterButton: ReactNode) => (
           <Dropdown
             dropdownId="settings-admin-apps-filter-dropdown"
             dropdownPlacement="bottom-end"
             dropdownOffset={{ x: 0, y: 8 }}
             clickableComponent={filterButton}
             dropdownComponents={
               <DropdownContent>
                 <DropdownMenuItemsContainer>
                   <MenuItemToggle
                     LeftIcon={IconPinned}
                     onToggleChange={() =>
                       setShowPreInstalledOnly(!showPreInstalledOnly)
                     }
                     toggled={showPreInstalledOnly}
                     text="Pra-terpasang saja"
                     toggleSize="small"
                   />
                 </DropdownMenuItemsContainer>
               </DropdownContent>
             }
           />
         )}
       />
      <StyledTableContainer>
        <Table>
           <TableRow
             gridAutoColumns={TABLE_GRID}
             mobileGridAutoColumns={TABLE_GRID_MOBILE}
           >
             <TableHeader>Nama</TableHeader>
             <TableHeader align="right">Sumber</TableHeader>
             <TableHeader align="right">Terdaftar</TableHeader>
             <TableHeader align="right">Dikonfigurasi</TableHeader>
             <TableHeader></TableHeader>
          </TableRow>
          <TableBody>
            {filtered.map((registration) => (
              <SettingsAdminAppsTableRow
                key={registration.id}
                registration={registration}
                getFormattedSource={getFormattedSource}
              />
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Section>
  );
};

type SettingsAdminAppsTableRowProps = {
  registration: ApplicationRegistrationFragmentFragment;
  getFormattedSource: (
    registration: ApplicationRegistrationFragmentFragment,
  ) => string;
};

const SettingsAdminAppsTableRow = ({
  registration,
  getFormattedSource,
}: SettingsAdminAppsTableRowProps) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TableRow
      to={getSettingsPath(
        SettingsPath.AdminPanelApplicationRegistrationDetail,
        { applicationRegistrationId: registration.id },
      )}
      gridAutoColumns={TABLE_GRID}
      mobileGridAutoColumns={TABLE_GRID_MOBILE}
      isClickable
    >
      <TableCell
        color={themeCssVariables.font.color.primary}
        gap={themeCssVariables.spacing[2]}
        minWidth="0"
        overflow="hidden"
      >
        <AppChip
          size="md"
          fallbackApplicationData={{
            logo: registration.logoUrl,
            name: registration.name,
          }}
        />
      </TableCell>
      <TableCell overflow="hidden" align="right">
        {getFormattedSource(registration)}
      </TableCell>
       <TableCell align="right">
         {registration.isListed ? "Ya" : "Tidak"}
       </TableCell>
       <TableCell align="right">
         <Tag
           color={registration.isConfigured ? 'green' : 'red'}
           text={registration.isConfigured ? "Ya" : "Tidak"}
         />
       </TableCell>
      <TableCell align="right">
        <IconChevronRight
          size={theme.icon.size.md}
          color={theme.font.color.tertiary}
        />
      </TableCell>
    </TableRow>
  );
};
