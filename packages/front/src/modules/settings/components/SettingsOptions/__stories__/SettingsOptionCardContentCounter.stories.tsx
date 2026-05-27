import { SettingsOptionCardContentCounter } from '@/settings/components/SettingsOptions/SettingsOptionCardContentCounter';
import { styled } from '@linaria/react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { IconUsers } from 'ui/display';
import { ComponentDecorator } from 'ui/testing';

const StyledContainer = styled.div`
  width: 480px;
`;

const SettingsOptionCardContentCounterWrapper = (
  args: React.ComponentProps<typeof SettingsOptionCardContentCounter>,
) => {
  const [value, setValue] = useState(args.value);

  return (
    <StyledContainer>
      <SettingsOptionCardContentCounter
        value={value}
        onChange={setValue}
        Icon={args.Icon}
        title={args.title}
        description={args.description}
        disabled={args.disabled}
        minValue={args.minValue}
        maxValue={args.maxValue}
        showButtons={args.showButtons}
      />
    </StyledContainer>
  );
};

const meta: Meta<typeof SettingsOptionCardContentCounterWrapper> = {
  title: 'Modules/Settings/SettingsOptionCardContentCounter',
  component: SettingsOptionCardContentCounterWrapper,
  decorators: [ComponentDecorator],
  parameters: {
    maxWidth: 800,
  },
};

export default meta;
type Story = StoryObj<typeof SettingsOptionCardContentCounterWrapper>;

export const Default: Story = {
  args: {
    Icon: IconUsers,
    title: 'Anggota Tim',
    description: 'Tetapkan jumlah maksimum anggota tim',
    value: 5,
    minValue: 1,
    maxValue: 10,
    showButtons: true,
  },
  argTypes: {
    Icon: { control: false },
    onChange: { control: false },
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'Item per Halaman',
    description: 'Konfigurasi jumlah item yang ditampilkan per halaman',
    value: 20,
    minValue: 10,
    maxValue: 50,
    showButtons: true,
  },
};

export const Disabled: Story = {
  args: {
    Icon: IconUsers,
    title: 'Penghitung Nonaktif',
    description: 'Penghitung ini saat ini tidak aktif',
    value: 3,
    disabled: true,
    minValue: 1,
    maxValue: 10,
    showButtons: true,
  },
};

export const WithoutButtons: Story = {
  args: {
    Icon: IconUsers,
    title: 'Retensi Sampah',
    description: 'Sesuaikan jumlah hari sebelum penghapusan',
    value: 14,
    minValue: 0,
    showButtons: false,
  },
};
