import { type WorkflowFormAction } from '@/workflow/types/Workflow';
import { WorkflowEditActionFormFiller } from '@/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowEditActionFormFiller';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { FieldMetadataType } from 'shared/types';
import { ComponentDecorator, RouterDecorator } from 'ui/testing';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { WorkflowStepActionDrawerDecorator } from '~/testing/decorators/WorkflowStepActionDrawerDecorator';
import { WorkflowStepDecorator } from '~/testing/decorators/WorkflowStepDecorator';
import { WorkspaceDecorator } from '~/testing/decorators/WorkspaceDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

const meta: Meta<typeof WorkflowEditActionFormFiller> = {
  title: 'Modules/Workflow/Actions/Form/WorkflowEditActionFormFiller',
  component: WorkflowEditActionFormFiller,
  parameters: {
    msw: graphqlMocks,
  },
  decorators: [
    WorkflowStepActionDrawerDecorator,
    ComponentDecorator,
    WorkflowStepDecorator,
    RouterDecorator,
    ObjectMetadataItemsDecorator,
    WorkspaceDecorator,
    SnackBarDecorator,
  ],
};

export default meta;
type Story = StoryObj<typeof WorkflowEditActionFormFiller>;

const mockAction: WorkflowFormAction = {
  id: 'form-action-1',
  type: 'FORM',
  name: 'Formulir Uji',
  valid: true,
  settings: {
    input: [
      {
        id: 'field-1',
        name: 'text',
        label: 'Kolom Teks',
        type: FieldMetadataType.TEXT,
        placeholder: 'Masukkan teks',
        settings: {},
      },
      {
        id: 'field-2',
        name: 'number',
        label: 'Kolom Nomor',
        type: FieldMetadataType.NUMBER,
        placeholder: 'Masukkan nomor',
        settings: {},
      },
      {
        id: 'field-3',
        name: 'record',
        label: 'Rekaman',
        type: 'RECORD',
        placeholder: 'Pilih rekaman',
        settings: {
          objectName: 'keluarga',
        },
      },
      {
        id: 'field-4',
        name: 'date',
        label: 'Tanggal',
        type: FieldMetadataType.DATE,
        placeholder: 'dd/mm/yyyy',
        settings: {},
      },
    ],
    outputSchema: {},
    errorHandlingOptions: {
      retryOnFailure: { value: false },
      continueOnFailure: { value: false },
    },
  },
};

export const Default: Story = {
  args: {
    action: mockAction,
    actionOptions: {
      readonly: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textField = await canvas.findByText('Kolom Teks');
    expect(textField).toBeVisible();

    const numberField = await canvas.findByText('Kolom Nomor');
    expect(numberField).toBeVisible();

    const recordField = await canvas.findByText('Rekaman');
    expect(recordField).toBeVisible();

    const dateField = await canvas.findByText('Tanggal');
    expect(dateField).toBeVisible();
  },
};

export const ReadonlyMode: Story = {
  args: {
    action: mockAction,
    actionOptions: {
      readonly: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textField = await canvas.findByText('Kolom Teks');
    expect(textField).toBeVisible();

    const numberInput = await canvas.findByPlaceholderText('Masukkan nomor');
    expect(numberInput).toBeDisabled();

    const submitButton = canvas.queryByText('Kirim');
    expect(submitButton).not.toBeInTheDocument();
  },
};
