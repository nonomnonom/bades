import { FormAdvancedTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormAdvancedTextFieldInput';
import { WorkflowVariablePicker } from '@/workflow/workflow-variables/components/WorkflowVariablePicker';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { graphql, HttpResponse } from 'msw';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ComponentDecorator, RouterDecorator } from 'ui/testing';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { WorkflowStepActionDrawerDecorator } from '~/testing/decorators/WorkflowStepActionDrawerDecorator';
import { WorkflowStepDecorator } from '~/testing/decorators/WorkflowStepDecorator';
import { WorkspaceDecorator } from '~/testing/decorators/WorkspaceDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { getWorkflowNodeIdMock } from '~/testing/mock-data/workflow';

const DEFAULT_PROPS = {
  label: 'Kolom Teks Lanjutan',
  placeholder: 'Masukkan konten Anda...',
  defaultValue: '',
  onChange: fn(),
  readonly: false,
  minHeight: 200,
  maxWidth: 800,
};

const RICH_CONTENT_VALUE = JSON.stringify({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Welcome!' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Dear ' },
        {
          type: 'variableTag',
          attrs: { variable: '{{firstName}}' },
        },
        { type: 'text', text: ',' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Thank you for joining us! We are ' },
        {
          type: 'text',
          marks: [{ type: 'bold' }],
          text: 'excited',
        },
        { type: 'text', text: ' to have you on board.' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Visit our ' },
        {
          type: 'text',
          marks: [{ type: 'link', attrs: { href: 'https://bades.id' } }],
          text: 'website',
        },
        { type: 'text', text: ' to get started.' },
      ],
    },
  ],
});

const meta: Meta<typeof FormAdvancedTextFieldInput> = {
  title:
    'Modules/ObjectRecord/RecordField/FormTypes/FormAdvancedTextFieldInput',
  component: FormAdvancedTextFieldInput,
  parameters: {
    msw: {
      handlers: [
        ...graphqlMocks.handlers,
        graphql.query('FindManyWorkflows', () => {
          return HttpResponse.json({
            data: {
              workflows: [
                {
                  id: getWorkflowNodeIdMock(),
                  name: 'Test Workflow',
                  __typename: 'Workflow',
                },
              ],
            },
          });
        }),
      ],
    },
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

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...DEFAULT_PROPS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Kolom Teks Lanjutan')).toBeVisible();
    expect(await canvas.findByRole('textbox')).toBeVisible();
  },
};

export const WithRichContent: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Konten Rich Text',
    defaultValue: RICH_CONTENT_VALUE,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Konten Rich Text')).toBeVisible();
    expect(await canvas.findByText('Welcome!')).toBeVisible();
    expect(await canvas.findByText('excited')).toBeVisible();
    expect(await canvas.findByText('website')).toBeVisible();
  },
};

export const ReadOnly: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom Hanya Baca',
    defaultValue: RICH_CONTENT_VALUE,
    readonly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Kolom Hanya Baca')).toBeVisible();
    expect(await canvas.findByText('Welcome!')).toBeVisible();
  },
};

export const WithError: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom dengan Error',
    error: 'Kolom ini wajib diisi',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Kolom dengan Error')).toBeVisible();
    expect(await canvas.findByText('Kolom ini wajib diisi')).toBeVisible();
  },
};

export const WithHint: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom dengan Petunjuk',
    hint: 'Anda dapat menggunakan variabel, memformat teks, dan menambahkan gambar ke konten Anda.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Kolom dengan Petunjuk')).toBeVisible();
    expect(
      await canvas.findByText(
        'Anda dapat menggunakan variabel, memformat teks, dan menambahkan gambar ke konten Anda.',
      ),
    ).toBeVisible();
  },
};

export const Interactive: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom Interaktif',
    placeholder: 'Mulai ketik untuk melihat editor beraksi...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Kolom Interaktif')).toBeVisible();

    const editor = await canvas.findByRole('textbox');
    expect(editor).toBeVisible();

    await userEvent.click(editor);
    await userEvent.type(editor, 'Hello World!');
  },
};

export const WithVariablePicker: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom dengan Pemilih Variabel',
    VariablePicker: WorkflowVariablePicker,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await canvas.findByText('Kolom dengan Pemilih Variabel'),
    ).toBeVisible();
    expect(await canvas.findByRole('textbox')).toBeVisible();
  },
};

export const WithoutVariablePicker: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom tanpa Pemilih Variabel',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await canvas.findByText('Kolom tanpa Pemilih Variabel'),
    ).toBeVisible();
    expect(await canvas.findByRole('textbox')).toBeVisible();
  },
};

export const WithLongContent: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom dengan Konten Panjang',
    defaultValue: JSON.stringify({
      type: 'doc',
      content: Array.from({ length: 20 }, (_, i) => ({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: `This is paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
          },
        ],
      })),
    }),
  },
};

export const CustomSize: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom Ukuran Kustom',
    minHeight: 300,
    maxWidth: 600,
    placeholder: 'Kolom ini memiliki dimensi kustom...',
  },
};

export const DisabledFullScreen: Story = {
  args: {
    ...DEFAULT_PROPS,
    label: 'Kolom tanpa Layar Penuh',
    enableFullScreen: false,
  },
};
