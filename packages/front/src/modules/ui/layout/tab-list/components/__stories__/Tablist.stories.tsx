import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { styled } from '@linaria/react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import {
  IconCalendar,
  IconCheckbox,
  IconHeart,
  IconHome,
  IconMail,
  IconPhone,
  IconUser,
} from 'ui/display';
import { ComponentWithRouterDecorator } from 'ui/testing';

const tabs = [
  { id: 'general', title: 'Umum', logo: 'https://picsum.photos/200' },
  { id: 'contacts', title: 'Kontak', Icon: IconUser },
  { id: 'messages', title: 'Pesan', Icon: IconMail },
  { id: 'calls', title: 'Panggilan', Icon: IconPhone },
  { id: 'calendar', title: 'Kalender', Icon: IconCalendar },
  { id: 'sales', title: 'Penjualan', Icon: IconHome, disabled: true },
  { id: 'hidden', title: 'Tab Tersembunyi', Icon: IconCheckbox, hide: true },
  {
    id: 'time',
    title: 'Pelacakan Waktu',
    logo: 'https://picsum.photos/192/192',
  },
  {
    id: 'activity',
    title: 'Aktivitas',
    logo: 'https://picsum.photos/192/192',
    disabled: true,
  },
  { id: 'favorites', title: 'Favorit', Icon: IconHeart },
  { id: 'reports', title: 'Laporan', Icon: IconCheckbox },
];

import { themeCssVariables } from 'ui/theme-constants';

const StyledInteractiveContainer = styled.div`
  border: 1px solid ${themeCssVariables.border.color.strong};
  max-width: 100%;
  min-width: 300px;
  overflow: auto;
  padding: ${themeCssVariables.spacing[5]};
  resize: horizontal;
  width: 600px;
`;

const meta: Meta<typeof TabList> = {
  title: 'UI/Layout/TabList/TabList',
  component: TabList,
  args: {
    tabs: tabs,
    componentInstanceId: 'tab-list',
  },
  decorators: [ComponentWithRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof TabList>;

export const Default: Story = {
  args: {
    tabs: tabs,
    componentInstanceId: 'resizable-tabs',
  },
  render: (args) => (
    <StyledInteractiveContainer>
      <p>
        <strong>Seret sudut kanan-bawah untuk mengubah ukuran!</strong>
      </p>
      <TabList
        tabs={args.tabs}
        componentInstanceId={args.componentInstanceId}
        loading={args.loading}
        behaveAsLinks={args.behaveAsLinks}
        isInSidePanel={args.isInSidePanel}
        className={args.className}
      />
    </StyledInteractiveContainer>
  ),
};
