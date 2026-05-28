import { SettingsOptionCardContentSelect } from '@/settings/components/SettingsOptions/SettingsOptionCardContentSelect';
import { Select } from '@/ui/input/components/Select';
import { type SelectValue } from '@/ui/input/components/internal/select/types';
import { styled } from '@linaria/react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  IconLanguage,
  IconLayoutKanban,
  IconList,
  IconNotes,
  IconTable,
  IconUsers,
} from 'ui/display';
import { ComponentDecorator } from 'ui/testing';

const StyledContainer = styled.div`
  width: 480px;
`;

interface SettingsOptionCardContentSelectProps extends React.ComponentProps<
  typeof SettingsOptionCardContentSelect
> {}

interface SettingsOptionCardContentSelectWrapperProps extends SettingsOptionCardContentSelectProps {
  onChange: any;
  options: any;
  value: any;
  dropdownId: string;
}
const SettingsOptionCardContentSelectWrapper = <Value extends SelectValue>(
  args: SettingsOptionCardContentSelectWrapperProps,
) => {
  const [value] = useState<Value>(args.value);

  return (
    <StyledContainer>
      <SettingsOptionCardContentSelect
        Icon={args.Icon}
        title={args.title}
        description={args.description}
      >
        <Select<Value>
          value={value}
          onChange={args.onChange}
          dropdownId={args.dropdownId}
          options={args.options}
          selectSizeVariant="small"
          dropdownWidth={120}
        />
      </SettingsOptionCardContentSelect>
    </StyledContainer>
  );
};

const meta: Meta<typeof SettingsOptionCardContentSelectWrapper> = {
  title: 'Modules/Settings/SettingsOptionCardContentSelect',
  component: SettingsOptionCardContentSelectWrapper,
  decorators: [ComponentDecorator],
  parameters: {
    maxWidth: 800,
  },
};

export default meta;
type Story = StoryObj<typeof SettingsOptionCardContentSelectWrapper>;

export const StringSelect: Story = {
  args: {
    Icon: IconLanguage,
    title: 'Bahasa',
    description: 'Pilih bahasa yang Anda inginkan',
    value: 'en',
    options: [
      { value: 'en', label: 'Inggris' },
      { value: 'fr', label: 'Prancis' },
      { value: 'es', label: 'Spanyol' },
    ],
    dropdownId: 'language-select',
  },
  argTypes: {
    Icon: { control: false },
    onChange: { control: false },
  },
};

export const NumberSelect: Story = {
  args: {
    Icon: IconNotes,
    title: 'Item per Halaman',
    description: 'Jumlah item yang ditampilkan per halaman',
    value: 25,
    options: [
      { value: 10, label: '10' },
      { value: 25, label: '25' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
    ],
    dropdownId: 'page-size-select',
  },
};

export const WithIconOptions: Story = {
  args: {
    Icon: IconUsers,
    title: 'Tampilan Tim',
    description: 'Pilih cara menampilkan anggota tim',
    value: 'grid',
    options: [
      { value: 'list', label: 'Tampilan Daftar', Icon: IconList },
      { value: 'kanban', label: 'Tampilan Kanban', Icon: IconLayoutKanban },
      { value: 'table', label: 'Tampilan Tabel', Icon: IconTable },
    ],
    dropdownId: 'view-select',
  },
};

export const Disabled: Story = {
  args: {
    Icon: IconUsers,
    title: 'Pilihan Nonaktif',
    description: 'Pilihan ini saat ini tidak aktif',
    disabled: true,
    value: 'option1',
    options: [
      { value: 'option1', label: 'Opsi 1' },
      { value: 'option2', label: 'Opsi 2' },
      { value: 'option3', label: 'Opsi 3' },
    ],
    dropdownId: 'disabled-select',
  },
};

export const FullWidth: Story = {
  args: {
    title: 'Pilihan Lebar Penuh',
    description: 'Pilihan ini menggunakan lebar penuh dropdown',
    value: 'short',
    options: [
      { value: 'short', label: 'Opsi pendek' },
      {
        value: 'very-long',
        label: 'Pilihan yang sangat panjang',
      },
      {
        value: 'another-long',
        label: 'Pilihan panjang lainnya',
      },
    ],
    dropdownId: 'full-width-select',
  },
};
