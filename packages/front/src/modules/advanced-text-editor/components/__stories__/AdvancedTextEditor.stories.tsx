import { AdvancedTextEditor } from '@/advanced-text-editor/components/AdvancedTextEditor';
import { useAdvancedTextEditor } from '@/advanced-text-editor/hooks/useAdvancedTextEditor';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { isDefined } from 'shared/utils';
import { ComponentDecorator, RouterDecorator } from 'ui/testing';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { WorkflowStepActionDrawerDecorator } from '~/testing/decorators/WorkflowStepActionDrawerDecorator';
import { WorkflowStepDecorator } from '~/testing/decorators/WorkflowStepDecorator';
import { WorkspaceDecorator } from '~/testing/decorators/WorkspaceDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

const EditorWrapper = ({
  readonly = false,
  placeholder = 'Masukkan teks...',
  defaultValue = null,
  onUpdate = fn(),
  minHeight = 200,
  maxWidth = 800,
  enableSlashCommand = true,
}: {
  readonly?: boolean;
  placeholder?: string;
  defaultValue?: string | null;
  onUpdate?: (content: string) => void;
  minHeight?: number;
  maxWidth?: number;
  enableSlashCommand?: boolean;
}) => {
  const editor = useAdvancedTextEditor({
    placeholder,
    readonly,
    defaultValue,
    onUpdate: (editor) => {
      const jsonContent = editor.getJSON();
      onUpdate(JSON.stringify(jsonContent));
    },
    onImageUpload: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return `https://via.placeholder.com/400x200?text=${encodeURIComponent(file.name)}`;
    },
    onImageUploadError: (_error: Error, _file: File) => {
      // Handle image upload error
    },
    enableSlashCommand,
  });

  if (!editor) {
    return <div>Memuat editor...</div>;
  }

  return (
    <AdvancedTextEditor
      editor={editor}
      readonly={readonly}
      minHeight={minHeight}
      maxWidth={maxWidth}
    />
  );
};

const meta: Meta<typeof EditorWrapper> = {
  title: 'Modules/AdvancedTextEditor/AdvancedTextEditor',
  component: EditorWrapper,
  parameters: {
    msw: graphqlMocks,
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

type Story = StoryObj<typeof EditorWrapper>;

export const Default: Story = {
  args: {},
};

export const WithContent: Story = {
  args: {
    defaultValue: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Halo ',
            },
            {
              type: 'text',
              marks: [{ type: 'bold' }],
              text: 'Dunia',
            },
            {
              type: 'text',
              text: ',',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Ini contoh teks dengan ',
            },
            {
              type: 'text',
              marks: [{ type: 'italic' }],
              text: 'miring',
            },
            {
              type: 'text',
              text: ' dan ',
            },
            {
              type: 'text',
              marks: [{ type: 'underline' }],
              text: 'garis bawah',
            },
            {
              type: 'text',
              text: ' teks.',
            },
          ],
        },
      ],
    }),
  },
};

export const WithHeadings: Story = {
  args: {
    defaultValue: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Judul Utama' }],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Sub-judul' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Ini paragraf dengan beberapa isi.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Heading Lebih Kecil' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Paragraf lain di sini.' }],
        },
      ],
    }),
  },
};

export const WithLinks: Story = {
  args: {
    defaultValue: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Kunjungi ' },
            {
              type: 'text',
              marks: [{ type: 'link', attrs: { href: 'https://bades.id' } }],
              text: 'situs web',
            },
            { type: 'text', text: ' untuk informasi lebih lanjut.' },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hubungi kami di ' },
            {
              type: 'text',
              marks: [
                { type: 'link', attrs: { href: 'mailto:support@bades.id' } },
              ],
              text: 'support@bades.id',
            },
          ],
        },
      ],
    }),
  },
};

export const WithVariableTags: Story = {
  args: {
    defaultValue: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Yth. ' },
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
            { type: 'text', text: 'Pesanan Anda ' },
            {
              type: 'variableTag',
              attrs: { variable: '{{orderNumber}}' },
            },
            { type: 'text', text: ' telah diproses!' },
          ],
        },
      ],
    }),
  },
};

export const ReadOnly: Story = {
  args: {
    readonly: true,
    defaultValue: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [{ type: 'bold' }],
              text: 'Mode hanya baca',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Editor ini dalam mode hanya baca dan tidak dapat diubah.',
            },
          ],
        },
      ],
    }),
  },
};

export const Empty: Story = {
  args: {
    placeholder: 'Mulai ketik konten Anda...',
  },
};

export const Interactive: Story = {
  args: {
    onUpdate: fn(),
    placeholder: 'Coba ketik, format teks, atau upload gambar...',
  },
};

export const CustomSize: Story = {
  args: {
    minHeight: 300,
    maxWidth: 600,
    placeholder: 'Editor ini memiliki dimensi khusus...',
  },
};

export const WithLists: Story = {
  args: {
    defaultValue: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Kebutuhan Proyek' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Sistem autentikasi pengguna' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Integrasi database' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Endpoint API' }],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Langkah Implementasi' }],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Siapkan lingkungan pengembangan' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Buat skema database' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Implementasi autentikasi' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Bangun endpoint API' }],
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify bullet list is rendered', async () => {
      await waitFor(() =>
        expect(canvasElement.querySelectorAll('ul li').length).toBeGreaterThan(
          0,
        ),
      );

      const listItems = canvasElement.querySelectorAll('ul li');

      const firstItem = listItems[0];
      expect(firstItem).toBeInTheDocument();
      expect(firstItem).toHaveTextContent(/Sistem autentikasi pengguna/i);
    });

    await step('Verify ordered list is rendered', async () => {
      await waitFor(() =>
        expect(canvasElement.querySelectorAll('ol li').length).toBeGreaterThan(
          0,
        ),
      );

      const orderedListItems = canvasElement.querySelectorAll('ol li');

      const firstOrderedItem = orderedListItems[0];
      expect(firstOrderedItem).toBeInTheDocument();
      expect(firstOrderedItem).toHaveTextContent(
        /Siapkan lingkungan pengembangan/i,
      );
    });

    await step('Test list interaction', async () => {
      const editorContent = canvasElement.querySelector('.tiptap');
      expect(editorContent).toBeInTheDocument();

      const firstListItem = canvasElement.querySelector('ul li');
      if (isDefined(firstListItem)) {
        await userEvent.click(firstListItem);

        expect(editorContent).toHaveFocus();
      }
    });

    await step('Verify list structure', async () => {
      const bulletList = canvasElement.querySelector('ul');
      expect(bulletList).toBeInTheDocument();

      const orderedList = canvasElement.querySelector('ol');
      expect(orderedList).toBeInTheDocument();

      await waitFor(() =>
        expect(canvasElement.querySelectorAll('ul li').length).toBe(3),
      );

      await waitFor(() =>
        expect(canvasElement.querySelectorAll('ol li').length).toBe(4),
      );
    });
  },
};
