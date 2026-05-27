import { type Meta, type StoryObj } from '@storybook/react-vite';

import { TitleInput } from '@/ui/input/components/TitleInput';
import { ComponentDecorator } from 'ui/testing';

const meta: Meta<typeof TitleInput> = {
  title: 'UI/Input/TitleInput',
  component: TitleInput,
  decorators: [ComponentDecorator],
  args: {
    placeholder: 'Masukkan judul',
    sizeVariant: 'md',
  },
  argTypes: {
    sizeVariant: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof TitleInput>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: 'Judul Contoh' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Judul Dinonaktifkan' },
};

export const ExtraSmall: Story = {
  args: { sizeVariant: 'xs', value: 'Judul Extra Kecil' },
};

export const Small: Story = {
  args: { sizeVariant: 'sm', value: 'Judul Kecil' },
};

export const Medium: Story = {
  args: { sizeVariant: 'md', value: 'Judul Sedang' },
};

export const Large: Story = {
  args: { sizeVariant: 'lg', value: 'Judul Besar' },
};

export const WithLongText: Story = {
  args: {
    value:
      'Ini adalah judul yang sangat panjang dan kemungkinan akan meluap serta mendemonstrasikan perilaku tooltip komponen',
  },
  parameters: {
    container: {
      width: 250,
    },
  },
};

export const WithCustomPlaceholder: Story = {
  args: { placeholder: 'Contoh placeholder kustom' },
};
