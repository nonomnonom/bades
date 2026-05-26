import { FormFullNameFieldInput } from '@/object-record/record-field/ui/form-types/components/FormFullNameFieldInput';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { WorkflowStepDecorator } from '~/testing/decorators/WorkflowStepDecorator';
import { MOCKED_STEP_ID } from '~/testing/mock-data/workflow';

const meta: Meta<typeof FormFullNameFieldInput> = {
  title: 'UI/Data/Field/Form/Input/FormFullNameFieldInput',
  component: FormFullNameFieldInput,
  args: {},
  argTypes: {},
  decorators: [WorkflowStepDecorator],
};

export default meta;

type Story = StoryObj<typeof FormFullNameFieldInput>;

export const Default: Story = {
  args: {
    label: 'Name',
    defaultValue: {
      firstName: 'Budi',
      lastName: 'Saputra',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Name');
    await canvas.findByText('First Name');
    await canvas.findByText('Last Name');
  },
};

export const WithVariable: Story = {
  args: {
    label: 'Name',
    defaultValue: {
      firstName: `{{${MOCKED_STEP_ID}.name}}`,
      lastName: `{{${MOCKED_STEP_ID}.amount}}`,
    },
    VariablePicker: () => <div>VariablePicker</div>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findAllByText('Name');

    const lastNameVariable = await canvas.findByText('Amount');
    expect(lastNameVariable).toBeVisible();

    await canvas.findAllByText('VariablePicker');
  },
};

export const Disabled: Story = {
  args: {
    label: 'Name',
    readonly: true,
    defaultValue: {
      firstName: 'Budi',
      lastName: 'Saputra',
    },
    VariablePicker: () => <div>VariablePicker</div>,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const firstNameVariable = await canvas.findByText('Budi');
    const lastNameVariable = await canvas.findByText('Saputra');

    await userEvent.type(firstNameVariable, 'Siti');
    await userEvent.type(lastNameVariable, 'Santoso');

    expect(args.onChange).not.toHaveBeenCalled();

    const variablePickers = canvas.queryAllByText('VariablePicker');
    expect(variablePickers).toHaveLength(0);
  },
};
