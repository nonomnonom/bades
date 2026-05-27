import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { expect, within } from 'storybook/test';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { setTestObjectMetadataItemsInMetadataStore } from '~/testing/utils/setTestObjectMetadataItemsInMetadataStore';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { SettingsPath } from 'shared/types';
import { ComponentWithRouterDecorator } from '~/testing/decorators/ComponentWithRouterDecorator';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { LoadedDecorator } from '~/testing/decorators/LoadedDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { mockedWorkspaceMemberData } from '~/testing/mock-data/users';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';

import { NavigationDrawerFixedContent } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerFixedContent';
import { NavigationDrawerSubItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSubItem';
import { getSettingsPath } from 'shared/utils';
import {
  IconAt,
  IconBell,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconCheckbox,
  IconColorSwatch,
  IconMail,
  IconSearch,
  IconServer,
  IconSettings,
  IconTargetArrow,
  IconUser,
  IconUserCircle,
  IconUsers,
} from 'ui/display';
import { AdvancedSettingsToggle } from 'ui/navigation';
import { getOsControlSymbol } from 'ui/utilities';

import { NavigationDrawer } from '@/ui/navigation/navigation-drawer/components/NavigationDrawer';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerItemGroup } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItemGroup';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';

const meta: Meta<typeof NavigationDrawer> = {
  title: 'UI/Navigation/NavigationDrawer/NavigationDrawer',
  component: NavigationDrawer,
  decorators: [
    ComponentWithRouterDecorator,
    SnackBarDecorator,
    ObjectMetadataItemsDecorator,
    LoadedDecorator,
    (Story) => {
      const setCurrentWorkspaceMember = useSetAtomState(
        currentWorkspaceMemberState,
      );
      useEffect(() => {
        setTestObjectMetadataItemsInMetadataStore(
          jotaiStore,
          getTestEnrichedObjectMetadataItemsMock(),
        );
        setCurrentWorkspaceMember(mockedWorkspaceMemberData);
      }, [setCurrentWorkspaceMember]);
      return <Story />;
    },
  ],
  parameters: {
    layout: 'fullscreen',
    msw: graphqlMocks,
  },
  argTypes: { children: { control: false } },
};

export default meta;
type Story = StoryObj<typeof NavigationDrawer>;

export const Default: Story = {
  args: {
    title: 'Default',
    children: (
      <>
        <NavigationDrawerSection>
          <NavigationDrawerItem label="Cari" Icon={IconSearch} active />
          <NavigationDrawerItem
            label="Notifikasi"
            to="/inbox"
            Icon={IconBell}
            modifier="soon"
          />
          <NavigationDrawerItem
            label="Cari"
            Icon={IconSearch}
            modifier={{ keyboard: [`${getOsControlSymbol()}`, 'K'] }}
          />
          <NavigationDrawerItem
            label="Pengaturan"
            to="/settings/profile"
            Icon={IconSettings}
          />
          <NavigationDrawerItem label="Tugas" to="/tasks" Icon={IconCheckbox} />
        </NavigationDrawerSection>

        <NavigationDrawerSection>
          <NavigationDrawerSectionTitle label="Ruang Kerja" />
          <NavigationDrawerItem
            label="Perusahaan"
            to="/companies"
            Icon={IconBuildingSkyscraper}
          />
          <NavigationDrawerItem label="Warga" to="/people" Icon={IconUser} />
          <NavigationDrawerItem label="Peluang" Icon={IconTargetArrow} />
        </NavigationDrawerSection>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Ruang Kerja')).toBeInTheDocument();
  },
};

export const Settings: Story = {
  args: {
    title: 'Pengaturan',
    children: (
      <>
        <NavigationDrawerSection>
          <NavigationDrawerSectionTitle label="Pengguna" />
          <NavigationDrawerItem
            label="Profil"
            to={getSettingsPath(SettingsPath.ProfilePage)}
            Icon={IconUserCircle}
            active
          />
          <NavigationDrawerItem
            label="Tampilan"
            to={getSettingsPath(SettingsPath.Experience)}
            Icon={IconColorSwatch}
          />
          <NavigationDrawerItemGroup>
            <NavigationDrawerItem
              label="Akun"
              to={getSettingsPath(SettingsPath.Accounts)}
              Icon={IconAt}
            />
            <NavigationDrawerSubItem
              label="Email"
              to={getSettingsPath(SettingsPath.AccountsEmails)}
              Icon={IconMail}
              subItemState="intermediate-before-selected"
            />
            <NavigationDrawerSubItem
              label="Kalender"
              to={getSettingsPath(SettingsPath.AccountsCalendars)}
              Icon={IconCalendarEvent}
              subItemState="last-selected"
            />
          </NavigationDrawerItemGroup>
        </NavigationDrawerSection>

        <NavigationDrawerSection>
          <NavigationDrawerSectionTitle label="Ruang Kerja" />
          <NavigationDrawerItem
            label="Umum"
            to={getSettingsPath(SettingsPath.Workspace)}
            Icon={IconSettings}
          />
          <NavigationDrawerItem
            label="Anggota"
            to={getSettingsPath(SettingsPath.WorkspaceMembersPage)}
            Icon={IconUsers}
          />
        </NavigationDrawerSection>

        <NavigationDrawerSection>
          <NavigationDrawerSectionTitle label="Lainnya" />
          <NavigationDrawerItem
            label="Panel Admin"
            to={getSettingsPath(SettingsPath.AdminPanel)}
            Icon={IconServer}
          />
        </NavigationDrawerSection>

        <NavigationDrawerFixedContent>
          <AdvancedSettingsToggle
            isAdvancedModeEnabled={false}
            setIsAdvancedModeEnabled={() => {}}
            label="Tingkat Lanjut:"
          />
        </NavigationDrawerFixedContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Pengguna')).toBeInTheDocument();
  },
};
