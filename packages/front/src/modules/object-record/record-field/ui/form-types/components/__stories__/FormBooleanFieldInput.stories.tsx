import { FormBooleanFieldInput } from '@/object-record/record-field/ui/form-types/components/FormBooleanFieldInput';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { WorkflowStepDecorator } from '~/testing/decorators/WorkflowStepDecorator';
import { MOCKED_STEP_ID } from '~/testing/mock-data/workflow';

const meta: Meta<typeof FormBooleanFieldInput> = {
  title: 'UI/Data/Field/Form/Input/FormBooleanFieldInput',
  component: FormBooleanFieldInput,
  args: {},
  argTypes: {},
  decorators: [WorkflowStepDecorator],
};

export default meta;

type Story = StoryObj<typeof FormBooleanFieldInput>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Pilih nilai');
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Boole',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Boole');
  },
};

export const EmptyByDefault: Story = {
  args: {
    defaultValue: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Pilih nilai');
  },
};

export const TrueByDefault: Story = {
  args: {
    defaultValue: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Benar');
  },
};

export const FalseByDefault: Story = {
  args: {
    defaultValue: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Salah');
  },
};

export const WithVariablePicker: Story = {
  args: {
    VariablePicker: () => <div>VariablePicker</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const variablePicker = await canvas.findByText('VariablePicker');

    expect(variablePicker).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    readonly: true,
    defaultValue: false,
    VariablePicker: () => <div>VariablePicker</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toggle = await canvas.findByText('Salah');
    expect(toggle).toBeVisible();

    await userEvent.click(toggle);

    expect(toggle).toHaveTextContent('Salah');

    const variablePicker = canvas.queryByText('VariablePicker');
    expect(variablePicker).not.toBeInTheDocument();
  },
};

export const ChangesValueToTrue: Story = {
  args: {
    defaultValue: undefined,
    label: 'Boole',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const select = await canvas.findByText('Pilih nilai');

    await userEvent.click(select);

    const trueOption = await within(
      canvasElement.ownerDocument.body,
    ).findByText('Benar');

    await userEvent.click(trueOption);

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(true);
    });
  },
};

export const ChangesValueToFalse: Story = {
  args: {
    defaultValue: undefined,
    label: 'Boole',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const select = await canvas.findByText('Pilih nilai');

    await userEvent.click(select);

    const falseOption = await within(
      canvasElement.ownerDocument.body,
    ).findByText('Salah');

    await userEvent.click(falseOption);

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(false);
    });
  },
};

export const ChangesValueToVariable: Story = {
  args: {
    defaultValue: undefined,
    label: 'Boole',
    VariablePicker: ({ onVariableSelect }) => {
      return (
        <button
          onClick={() => {
            onVariableSelect(`{{${MOCKED_STEP_ID}.name}}`);
          }}
        >
          Tambah variabel
        </button>
      );
    },
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const addVariableButton = await canvas.findByRole('button', {
      name: 'Tambah variabel',
    });

    await userEvent.click(addVariableButton);

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(`{{${MOCKED_STEP_ID}.name}}`);
    });
  },
};
