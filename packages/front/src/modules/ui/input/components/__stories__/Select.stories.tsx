import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent, within } from 'storybook/test';

import { Select, type SelectProps } from '@/ui/input/components/Select';
import { IconPlus } from 'ui/display';
import { ComponentDecorator } from 'ui/testing';

type RenderProps = SelectProps<string | number | boolean | null>;

const Render = (args: RenderProps) => {
  const [value, setValue] = useState(args.value);
  const handleChange = (value: string | number | boolean | null) => {
    args.onChange?.(value);
    setValue(value);
  };

  // oxlint-disable-next-line react/jsx-props-no-spreading
  return <Select {...args} value={value} onChange={handleChange} />;
};

const meta: Meta<typeof Select> = {
  title: 'UI/Input/Select',
  component: Select,
  decorators: [ComponentDecorator],
  args: {
    dropdownId: 'select',
    value: 'a',
    options: [
      { value: 'a', label: 'Opsi A' },
      { value: 'b', label: 'Opsi B' },
      { value: 'c', label: 'Opsi C' },
    ],
  },
  render: Render,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const selectLabel = await canvas.getByText('Opsi A');

    await userEvent.click(selectLabel);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithSearch: Story = {
  args: { withSearchInput: true },
};

export const CallToActionButton: Story = {
  args: {
    callToActionButton: {
      onClick: () => {},
      Icon: IconPlus,
      text: 'Tambah aksi',
    },
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Label uji',
  },
};

export const WithDescription: Story = {
  args: {
    description: 'Deskripsi uji',
  },
};

export const WithNullOption: Story = {
  args: {
    options: [
      { value: 'a', label: 'Opsi A' },
      { value: 'b', label: 'Opsi B' },
      { value: null, label: 'Opsi C' },
    ],
  },
};

export const WithoutOptions: Story = {
  args: {
    options: [],
  },
};
