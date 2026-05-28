import { FormArrayFieldInput } from '@/object-record/record-field/ui/form-types/components/FormArrayFieldInput';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { isDefined } from 'shared/utils';
import { WorkflowStepDecorator } from '~/testing/decorators/WorkflowStepDecorator';
import { MOCKED_STEP_ID } from '~/testing/mock-data/workflow';

const meta: Meta<typeof FormArrayFieldInput> = {
  title: 'UI/Data/Field/Form/Input/FormArrayFieldInput',
  component: FormArrayFieldInput,
  args: {},
  argTypes: {},
  decorators: [WorkflowStepDecorator],
};

export default meta;

type Story = StoryObj<typeof FormArrayFieldInput>;

export const AddTwoItems: Story = {
  args: {
    label: 'Item',
    defaultValue: undefined,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const emptyInput = await canvas.findByPlaceholderText('Masukkan item');

    await userEvent.type(emptyInput, 'Item pertama{enter}');

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(['Item pertama']);
    });

    const firstItemChip = await canvas.findByText('Item pertama');

    expect(firstItemChip).toBeVisible();

    await waitFor(() => {
      expect(emptyInput).not.toBeVisible();
    });

    const addItemButton = await within(
      canvasElement.ownerDocument.body,
    ).findByText('Tambah item');

    await userEvent.click(addItemButton);

    await waitFor(() => {
      expect(addItemButton).not.toBeVisible();
    });

    const newItemInput = await within(
      canvasElement.ownerDocument.body,
    ).findByRole('textbox');

    await userEvent.type(newItemInput, 'Item kedua{enter}');

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith([
        'Item pertama',
        'Item kedua',
      ]);
    });

    await waitFor(() => {
      expect(newItemInput).not.toBeVisible();
    });

    const secondItemMenuItem = await waitFor(() => {
      const allSecondItems = within(
        canvasElement.ownerDocument.body,
      ).getAllByText('Item kedua');

      expect(allSecondItems).toHaveLength(2);

      return allSecondItems[1];
    });

    expect(secondItemMenuItem).toBeVisible();
  },
};

export const EditExistingItem: Story = {
  args: {
    label: 'Item',
    defaultValue: ['Item pertama', 'Item kedua'],
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const firstItemChip = await canvas.findByText('Item pertama');

    await userEvent.click(firstItemChip);

    const openSecondItemMenuButton = await waitFor(() => {
      const button = canvasElement.ownerDocument.body.querySelector(
        '[aria-controls$="-1-options"] > button',
      );

      if (!isDefined(button)) {
        throw new Error('Button not found');
      }

      return button;
    });

    await userEvent.click(openSecondItemMenuButton);

    const editSecondItemButton = await within(
      canvasElement.ownerDocument.body,
    ).findByText('Sunting');

    await userEvent.click(editSecondItemButton);

    const editSecondItemInput = await within(
      canvasElement.ownerDocument.body,
    ).findByRole('textbox');

    expect(editSecondItemInput).toHaveValue('Item kedua');

    await userEvent.clear(editSecondItemInput);
    await userEvent.type(
      editSecondItemInput,
      'Item kedua yang diperbarui{enter}',
    );

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith([
        'Item pertama',
        'Item kedua yang diperbarui',
      ]);
    });

    const updatedSecondItemChip = await canvas.findByText(
      'Item kedua yang diperbarui',
    );

    expect(updatedSecondItemChip).toBeVisible();
  },
};

export const DeleteExistingItem: Story = {
  args: {
    label: 'Item',
    defaultValue: ['Item pertama', 'Item kedua'],
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const firstItemChip = await canvas.findByText('Item pertama');

    await userEvent.click(firstItemChip);

    const openSecondItemMenuButton = await waitFor(() => {
      const button = canvasElement.ownerDocument.body.querySelector(
        '[aria-controls$="-1-options"] > button',
      );

      if (!isDefined(button)) {
        throw new Error('Button not found');
      }

      return button;
    });

    await userEvent.click(openSecondItemMenuButton);

    const deleteSecondItemButton = await within(
      canvasElement.ownerDocument.body,
    ).findByText('Hapus');

    await userEvent.click(deleteSecondItemButton);

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(['Item pertama']);
    });

    expect(canvas.queryByText('Item kedua')).not.toBeInTheDocument();
  },
};

export const SetVariable: Story = {
  args: {
    label: 'Item',
    defaultValue: undefined,
    onChange: fn(),
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

    const variable = await canvas.findByText('Nama');

    expect(variable).toBeVisible();
  },
};

export const ReplaceItemsWithVariable: Story = {
  args: {
    label: 'Item',
    defaultValue: ['Item pertama', 'Item kedua'],
    onChange: fn(),
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

    const variable = await canvas.findByText('Nama');

    expect(variable).toBeVisible();
  },
};

export const ReplaceVariableWithItems: Story = {
  args: {
    label: 'Item',
    defaultValue: `{{${MOCKED_STEP_ID}.createdAt}}`,
    onChange: fn(),
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
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const deleteVariableButton = await canvas.findByRole('button', {
      name: 'Hapus variabel',
    });

    await userEvent.click(deleteVariableButton);

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith([]);
    });

    const emptyInput = await canvas.findByPlaceholderText('Masukkan item');

    await userEvent.type(emptyInput, 'Item pertama{enter}');

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(['Item pertama']);
    });

    const firstItemChip = await canvas.findByText('Item pertama');

    expect(firstItemChip).toBeVisible();
  },
};

export const DisabledEmptyField: Story = {
  args: {
    defaultValue: undefined,
    onChange: fn(),
    readonly: true,
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.textContent).toBe('');
    });
  },
};

export const DisabledWithItems: Story = {
  args: {
    label: 'Item',
    defaultValue: ['Item pertama', 'Item kedua'],
    onChange: fn(),
    readonly: true,
  },
  play: async ({ canvasElement, args }) => {
    for (const item of args.defaultValue as string[]) {
      const itemChip = await within(canvasElement).findByText(item);

      expect(itemChip).toBeVisible();
    }
  },
};

export const DisabledWithVariable: Story = {
  args: {
    label: 'Item',
    defaultValue: `{{${MOCKED_STEP_ID}.createdAt}}`,
    onChange: fn(),
    readonly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const variableChip = await canvas.findByText('Tanggal pembuatan');
    expect(variableChip).toBeVisible();

    await userEvent.click(variableChip);

    const searchInputInModal = canvas.queryByPlaceholderText('Cari');
    expect(searchInputInModal).not.toBeInTheDocument();
  },
};
