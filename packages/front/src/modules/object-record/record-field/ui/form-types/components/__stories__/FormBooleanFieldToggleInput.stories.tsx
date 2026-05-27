import { FormBooleanFieldToggleInput } from '@/object-record/record-field/ui/form-types/components/FormBooleanFieldToggleInput';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

const meta: Meta<typeof FormBooleanFieldToggleInput> = {
  title: 'UI/Data/Field/Form/Input/FormBooleanFieldToggleInput',
  component: FormBooleanFieldToggleInput,
  args: {
    description: 'Lanjutkan jika iterasi gagal',
    value: false,
    onChange: fn(),
  },
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FormBooleanFieldToggleInput>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Lanjutkan jika iterasi gagal');

    const checkbox = canvas.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Pengaturan',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Pengaturan');
    await canvas.findByText('Lanjutkan jika iterasi gagal');
  },
};

export const WithHint: Story = {
  args: {
    hint: 'Jika diaktifkan, alur kerja akan berlanjut ke iterasi berikutnya meskipun iterasi saat ini gagal.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText(
      'Jika diaktifkan, alur kerja akan berlanjut ke iterasi berikutnya meskipun iterasi saat ini gagal.',
    );
  },
};

export const ToggledOn: Story = {
  args: {
    value: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');

    expect(checkbox).toBeChecked();
  },
};

export const TogglesValue: Story = {
  args: {
    value: false,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(true);
    });
  },
};
