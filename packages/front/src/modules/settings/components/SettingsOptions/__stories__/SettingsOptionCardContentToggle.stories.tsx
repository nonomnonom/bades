import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { styled } from '@linaria/react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { IconBell, IconLock, IconRobot, IconUsers } from 'ui/display';
import { ComponentDecorator } from 'ui/testing';

const StyledContainer = styled.div`
  width: 480px;
`;

const SettingsOptionCardContentToggleWrapper = (
  args: React.ComponentProps<typeof SettingsOptionCardContentToggle>,
) => {
  const [checked, setChecked] = useState(args.checked);

  return (
    <StyledContainer>
      <SettingsOptionCardContentToggle
        checked={checked}
        onChange={setChecked}
        Icon={args.Icon}
        title={args.title}
        description={args.description}
        divider={args.divider}
        disabled={args.disabled}
        advancedMode={args.advancedMode}
      />
    </StyledContainer>
  );
};

const meta: Meta<typeof SettingsOptionCardContentToggleWrapper> = {
  title: 'Modules/Settings/SettingsOptionCardContentToggle',
  component: SettingsOptionCardContentToggleWrapper,
  decorators: [ComponentDecorator],
  parameters: {
    maxWidth: 800,
  },
};

export default meta;
type Story = StoryObj<typeof SettingsOptionCardContentToggleWrapper>;

export const Default: Story = {
  args: {
    Icon: IconBell,
    title: 'Notifikasi',
    description: 'Terima notifikasi tentang pembaruan penting',
    checked: true,
  },
  argTypes: {
    Icon: { control: false },
    onChange: { control: false },
  },
};

export const Disabled: Story = {
  args: {
    Icon: IconLock,
    title: 'Pengaturan Terkunci',
    description: 'Pengaturan ini saat ini tidak tersedia',
    checked: false,
    disabled: true,
  },
};

export const AdvancedMode: Story = {
  args: {
    Icon: IconRobot,
    title: 'Fitur Lanjutan',
    description: 'Aktifkan fitur eksperimental',
    checked: true,
    advancedMode: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'Toggle Sederhana',
    description: 'Toggle dasar tanpa ikon',
    checked: true,
  },
};

export const WithoutDescription: Story = {
  args: {
    Icon: IconUsers,
    title: 'Akses Tim',
    checked: false,
  },
};
