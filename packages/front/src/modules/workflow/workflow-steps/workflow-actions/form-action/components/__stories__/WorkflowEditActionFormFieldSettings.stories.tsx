import { type WorkflowFormAction } from '@/workflow/types/Workflow';
import { WorkflowEditActionFormFieldSettings } from '@/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowEditActionFormFieldSettings';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FieldMetadataType } from 'shared/types';
import { ComponentDecorator } from 'ui/testing';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { WorkflowStepActionDrawerDecorator } from '~/testing/decorators/WorkflowStepActionDrawerDecorator';

const meta: Meta<typeof WorkflowEditActionFormFieldSettings> = {
  title: 'Modules/Workflow/Actions/Form/WorkflowEditActionFormFieldSettings',
  component: WorkflowEditActionFormFieldSettings,
  decorators: [
    WorkflowStepActionDrawerDecorator,
    ComponentDecorator,
    ObjectMetadataItemsDecorator,
  ],
};

export default meta;
type Story = StoryObj<typeof WorkflowEditActionFormFieldSettings>;

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
    ],
    outputSchema: {},
    errorHandlingOptions: {
      retryOnFailure: { value: false },
      continueOnFailure: { value: false },
    },
  },
};

export const TextFieldSettings: Story = {
  args: {
    field: mockAction.settings.input[0],
    onClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const typeSelect = await canvas.findByText('Teks');
    expect(typeSelect).toBeVisible();

    const placeholderInput = await canvas.findByText('Masukkan teks');
    expect(placeholderInput).toBeVisible();

    const closeButton = await canvas.findByTestId('close-button');
    await userEvent.click(closeButton);
    expect(args.onClose).toHaveBeenCalled();
  },
};

export const NumberFieldSettings: Story = {
  args: {
    field: {
      id: 'field-2',
      name: 'number',
      label: 'Kolom Nomor',
      type: FieldMetadataType.NUMBER,
      placeholder: 'Masukkan nomor',
      settings: {},
    },
    onClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const typeSelect = await canvas.findByText('Nomor');
    expect(typeSelect).toBeVisible();

    const placeholderInput = await canvas.findByText('Masukkan nomor');
    expect(placeholderInput).toBeInTheDocument();

    const closeButton = await canvas.findByTestId('close-button');
    await userEvent.click(closeButton);
    expect(args.onClose).toHaveBeenCalled();
  },
};

export const SingleRecordFieldSettings: Story = {
  args: {
    field: {
      id: 'field-3',
      name: 'keluarga',
      label: 'Keluarga',
      type: 'RECORD',
      settings: {
        objectName: 'keluarga',
      },
    },
    onClose: fn(),
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const typeSelect = await canvas.findByText('Rekaman');
    expect(typeSelect).toBeVisible();

    const objectSelect = await canvas.findByText('Keluarga');
    expect(objectSelect).toBeVisible();

    const closeButton = await canvas.findByTestId('close-button');
    await userEvent.click(closeButton);
    expect(args.onClose).toHaveBeenCalled();
  },
};

export const DateFieldSettings: Story = {
  args: {
    field: {
      id: 'field-4',
      name: 'date',
      label: 'Kolom Tanggal',
      type: FieldMetadataType.DATE,
      placeholder: 'Masukkan tanggal',
      settings: {},
    },
    onClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const typeSelect = await canvas.findByText('Tanggal');
    expect(typeSelect).toBeVisible();

    const closeButton = await canvas.findByTestId('close-button');
    await userEvent.click(closeButton);
    expect(args.onClose).toHaveBeenCalled();
  },
};

export const SelectFieldSettings: Story = {
  args: {
    field: {
      id: 'field-5',
      name: 'select',
      label: 'Pilih Kolom',
      type: FieldMetadataType.SELECT,
      settings: {
        selectedFieldId: 'field-1',
      },
    },
    onClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const fieldTypeSelect = await canvas.findByText('Teks');
    expect(fieldTypeSelect).toBeVisible();

    const selectTypeSelect = await canvas.findByText('Pilih');
    expect(selectTypeSelect).toBeVisible();

    const closeButton = await canvas.findByTestId('close-button');
    await userEvent.click(closeButton);
    expect(args.onClose).toHaveBeenCalled();
  },
};
