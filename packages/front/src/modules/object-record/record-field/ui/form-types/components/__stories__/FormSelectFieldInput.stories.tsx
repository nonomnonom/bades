import { FormSelectFieldInput } from '@/object-record/record-field/ui/form-types/components/FormSelectFieldInput';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { WorkflowStepDecorator } from '~/testing/decorators/WorkflowStepDecorator';
import { MOCKED_STEP_ID } from '~/testing/mock-data/workflow';

const meta: Meta<typeof FormSelectFieldInput> = {
  title: 'UI/Data/Field/Form/Input/FormSelectFieldInput',
  component: FormSelectFieldInput,
  args: {},
  argTypes: {},
  decorators: [WorkflowStepDecorator],
};

export default meta;

type Story = StoryObj<typeof FormSelectFieldInput>;

export const Default: Story = {
  args: {
    label: 'Kebijakan Kerja',
    defaultValue: 'WORK_POLICY_1',
    options: [
      {
        label: 'Kebijakan Kerja 1',
        value: 'WORK_POLICY_1',
        color: 'blue',
      },
      {
        label: 'Kebijakan Kerja 2',
        value: 'WORK_POLICY_2',
        color: 'green',
      },
      {
        label: 'Kebijakan Kerja 3',
        value: 'WORK_POLICY_3',
        color: 'red',
      },
      {
        label: 'Kebijakan Kerja 4',
        value: 'WORK_POLICY_4',
        color: 'yellow',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const selectedOption = await canvas.findByText('Kebijakan Kerja');

    expect(selectedOption).toBeVisible();
  },
};

export const WithVariablePicker: Story = {
  args: {
    label: 'Kebijakan Kerja',
    defaultValue: 'WORK_POLICY_1',
    options: [
      {
        label: 'Kebijakan Kerja 1',
        value: 'WORK_POLICY_1',
        color: 'blue',
      },
    ],
    onChange: fn(),
    VariablePicker: () => <div>VariablePicker</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstChip = await canvas.findByText('Work Policy 1');
    expect(firstChip).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    label: 'Kebijakan Kerja',
    defaultValue: 'WORK_POLICY_1',
    options: [
      {
        label: 'Kebijakan Kerja 1',
        value: 'WORK_POLICY_1',
        color: 'blue',
      },
      {
        label: 'Kebijakan Kerja 2',
        value: 'WORK_POLICY_2',
        color: 'green',
      },
      {
        label: 'Kebijakan Kerja 3',
        value: 'WORK_POLICY_3',
        color: 'red',
      },
      {
        label: 'Kebijakan Kerja 4',
        value: 'WORK_POLICY_4',
        color: 'yellow',
      },
    ],
    onChange: fn(),
    readonly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstChip = await canvas.findByText('Kebijakan Kerja 1');
    expect(firstChip).toBeVisible();

    await userEvent.click(firstChip);

    const searchInputInModal = canvas.queryByPlaceholderText('Cari');
    expect(searchInputInModal).not.toBeInTheDocument();
  },
};

export const DisabledWithVariable: Story = {
  args: {
    label: 'Tanggal Dibuat',
    defaultValue: `{{${MOCKED_STEP_ID}.createdAt}}`,
    options: [
      {
        label: 'Kebijakan Kerja 1',
        value: 'WORK_POLICY_1',
        color: 'blue',
      },
      {
        label: 'Kebijakan Kerja 2',
        value: 'WORK_POLICY_2',
        color: 'green',
      },
      {
        label: 'Kebijakan Kerja 3',
        value: 'WORK_POLICY_3',
        color: 'red',
      },
      {
        label: 'Kebijakan Kerja 4',
        value: 'WORK_POLICY_4',
        color: 'yellow',
      },
    ],
    onChange: fn(),
    readonly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const variableChip = await canvas.findByText('Tanggal Pembuatan');
    expect(variableChip).toBeVisible();

    await userEvent.click(variableChip);

    const searchInputInModal = canvas.queryByPlaceholderText('Cari');
    expect(searchInputInModal).not.toBeInTheDocument();
  },
};
