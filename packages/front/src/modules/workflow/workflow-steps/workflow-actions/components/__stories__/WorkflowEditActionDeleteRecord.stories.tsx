import { type WorkflowDeleteRecordAction } from '@/workflow/types/Workflow';
import { WorkflowEditActionDeleteRecord } from '@/workflow/workflow-steps/workflow-actions/components/WorkflowEditActionDeleteRecord';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ComponentDecorator, RouterDecorator } from 'ui/testing';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { WorkflowStepActionDrawerDecorator } from '~/testing/decorators/WorkflowStepActionDrawerDecorator';
import { WorkflowStepDecorator } from '~/testing/decorators/WorkflowStepDecorator';
import { WorkspaceDecorator } from '~/testing/decorators/WorkspaceDecorator';
import { getRecordFromRecordNode } from '@/object-record/cache/utils/getRecordFromRecordNode';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';
import { getWorkflowNodeIdMock } from '~/testing/mock-data/workflow';

const DEFAULT_ACTION = {
  id: getWorkflowNodeIdMock(),
  name: 'Delete Record',
  type: 'DELETE_RECORD',
  valid: false,
  settings: {
    input: {
      objectName: 'penduduk',
      objectRecordId: '',
    },
    outputSchema: {},
    errorHandlingOptions: {
      retryOnFailure: {
        value: false,
      },
      continueOnFailure: {
        value: false,
      },
    },
  },
} satisfies WorkflowDeleteRecordAction;

const meta: Meta<typeof WorkflowEditActionDeleteRecord> = {
  title: 'Modules/Workflow/Actions/DeleteRecord/EditAction',
  component: WorkflowEditActionDeleteRecord,
  parameters: {
    msw: graphqlMocks,
  },
  args: {
    action: DEFAULT_ACTION,
  },
  decorators: [
    WorkflowStepActionDrawerDecorator,
    WorkflowStepDecorator,
    ComponentDecorator,
    ObjectMetadataItemsDecorator,
    SnackBarDecorator,
    RouterDecorator,
    WorkspaceDecorator,
  ],
};

export default meta;

type Story = StoryObj<typeof WorkflowEditActionDeleteRecord>;

export const Default: Story = {
  args: {
    actionOptions: {
      onActionUpdate: fn(),
    },
  },
};

export const DisabledWithEmptyValues: Story = {
  args: {
    actionOptions: {
      readonly: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const objectSelectCurrentValue = await canvas.findByText('People');

    await userEvent.click(objectSelectCurrentValue);

    {
      const searchInputInSelectDropdown = canvas.queryByPlaceholderText('Cari');

      expect(searchInputInSelectDropdown).not.toBeInTheDocument();
    }

    const openRecordSelectButton = within(
      await canvas.findByTestId(
        'workflow-edit-action-record-delete-object-record-id',
      ),
    ).queryByRole('button');

    expect(openRecordSelectButton).not.toBeInTheDocument();
  },
};

const flatPersonRecords = mockedPendudukRecords.map((record) =>
  getRecordFromRecordNode({ recordNode: record }),
);

const peopleMock = flatPersonRecords[0];

export const DisabledWithDefaultStaticValues: Story = {
  args: {
    action: {
      ...DEFAULT_ACTION,
      settings: {
        ...DEFAULT_ACTION.settings,
        input: {
          ...DEFAULT_ACTION.settings.input,
          objectRecordId: peopleMock.id,
        },
      },
    },
    actionOptions: {
      readonly: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const objectSelectCurrentValue = await canvas.findByText('People');

    await userEvent.click(objectSelectCurrentValue);

    {
      const searchInputInSelectDropdown = canvas.queryByPlaceholderText('Cari');

      expect(searchInputInSelectDropdown).not.toBeInTheDocument();
    }

    const openRecordSelectButton = within(
      await canvas.findByTestId(
        'workflow-edit-action-record-delete-object-record-id',
      ),
    ).queryByRole('button');

    expect(openRecordSelectButton).not.toBeInTheDocument();

    const selectedRecordToDelete = await canvas.findByText(
      `${peopleMock.namaLengkap.firstName} ${peopleMock.namaLengkap.lastName}`,
      undefined,
      {
        timeout: 3000,
      },
    );

    expect(selectedRecordToDelete).toBeVisible();
  },
};

export const DisabledWithDefaultVariableValues: Story = {
  args: {
    action: {
      ...DEFAULT_ACTION,
      settings: {
        ...DEFAULT_ACTION.settings,
        input: {
          ...DEFAULT_ACTION.settings.input,
          objectRecordId: '{{trigger.recordId}}',
        },
      },
    },
    actionOptions: {
      readonly: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const objectSelectCurrentValue = await canvas.findByText('People');

    await userEvent.click(objectSelectCurrentValue);

    {
      const searchInputInSelectDropdown = canvas.queryByPlaceholderText('Cari');

      expect(searchInputInSelectDropdown).not.toBeInTheDocument();
    }

    const openRecordSelectButton = within(
      await canvas.findByTestId(
        'workflow-edit-action-record-delete-object-record-id',
      ),
    ).queryByRole('button');

    expect(openRecordSelectButton).not.toBeInTheDocument();
  },
};
