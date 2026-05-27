import { type FieldMultiSelectValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { getRecordFieldInputInstanceId } from '@/object-record/utils/getRecordFieldInputId';
import { MultiSelectInput } from '@/ui/field/input/components/MultiSelectInput';
import { usePushFocusItemToFocusStack } from '@/ui/utilities/focus/hooks/usePushFocusItemToFocusStack';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  IconBolt,
  IconBrandGoogle,
  IconBrandLinkedin,
  IconCheck,
  IconHeart,
  IconRocket,
  IconTag,
  IconTarget,
} from 'ui/display';
import { type SelectOption } from 'ui/input';
import { ComponentDecorator } from 'ui/testing';

type RenderProps = {
  values: FieldMultiSelectValue;
  options: SelectOption[];
  onOptionSelected: (value: FieldMultiSelectValue) => void;
  onCancel?: () => void;
  dropdownWidth?: number;
};

const sampleOptions: SelectOption[] = [
  {
    value: 'social-media',
    label: 'Media Sosial',
    color: 'blue',
    Icon: IconTag,
  },
  {
    value: 'search-engine',
    label: 'Mesin Pencari',
    color: 'green',
    Icon: IconBrandGoogle,
  },
  {
    value: 'professional',
    label: 'Jaringan Profesional',
    color: 'purple',
    Icon: IconBrandLinkedin,
  },
  { value: 'referral', label: 'Rujukan', color: 'orange', Icon: IconTag },
  {
    value: 'advertising',
    label: 'Periklanan',
    color: 'red',
    Icon: IconTarget,
  },
  {
    value: 'content',
    label: 'Pemasaran Konten',
    color: 'yellow',
    Icon: IconCheck,
  },
  { value: 'email', label: 'Kampanye Email', color: 'pink', Icon: IconHeart },
  {
    value: 'viral',
    label: 'Pemasaran Viral',
    color: 'turquoise',
    Icon: IconBolt,
  },
  { value: 'growth', label: 'Pertumbuhan', color: 'gray', Icon: IconRocket },
];

const priorityOptions: SelectOption[] = [
  { value: 'low', label: 'Rendah', color: 'green' },
  { value: 'medium', label: 'Sedang', color: 'yellow' },
  { value: 'high', label: 'Tinggi', color: 'orange' },
  { value: 'urgent', label: 'Mendesak', color: 'red' },
];

const instanceId = getRecordFieldInputInstanceId({
  recordId: '123',
  fieldName: 'Relation',
  prefix: 'multi-select-story',
});

const Render = ({
  values,
  options,
  onOptionSelected,
  onCancel,
  dropdownWidth,
}: RenderProps) => {
  const [currentValues, setCurrentValues] =
    useState<FieldMultiSelectValue>(values);

  const { pushFocusItemToFocusStack } = usePushFocusItemToFocusStack();

  useEffect(() => {
    pushFocusItemToFocusStack({
      focusId: instanceId,
      component: {
        type: FocusComponentType.DROPDOWN,
        instanceId,
      },
    });
  }, [pushFocusItemToFocusStack]);

  const handleOptionSelected = (newValues: FieldMultiSelectValue) => {
    setCurrentValues(newValues);
    onOptionSelected(newValues);
  };

  return (
    <div style={{ height: '400px', padding: '20px' }}>
      <MultiSelectInput
        selectableListComponentInstanceId="multi-select-story"
        values={currentValues}
        options={options}
        focusId={instanceId}
        onCancel={onCancel}
        onOptionSelected={handleOptionSelected}
        dropdownWidth={dropdownWidth}
      />
    </div>
  );
};

const meta: Meta<typeof MultiSelectInput> = {
  title: 'UI/Field/Input/MultiSelectInput',
  component: MultiSelectInput,
  decorators: [ComponentDecorator],
  args: {
    values: [],
    options: sampleOptions,
    onOptionSelected: fn(),
  },
  render: Render,
};

export default meta;
type Story = StoryObj<typeof MultiSelectInput>;

export const Default: Story = {
  args: {
    values: [],
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByRole('textbox')).toBeVisible();
    });

    for (const option of sampleOptions) {
      expect(canvas.getByText(option.label)).toBeVisible();
    }
  },
};

export const WithPreselectedValues: Story = {
  args: {
    values: ['social-media', 'search-engine'],
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByRole('textbox')).toBeVisible();
    });

    await waitFor(() => {
      const checkboxes = canvas.getAllByRole('checkbox', { checked: true });

      expect(checkboxes).toHaveLength(2);
    });

    for (const option of sampleOptions) {
      expect(canvas.getByText(option.label)).toBeVisible();
    }
  },
};

export const SingleSelection: Story = {
  args: {
    values: ['professional'],
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByRole('textbox')).toBeVisible();
    });

    await waitFor(() => {
      const checkboxes = canvas.getAllByRole('checkbox', { checked: true });

      expect(checkboxes).toHaveLength(1);
    });

    for (const option of sampleOptions) {
      expect(canvas.getByText(option.label)).toBeVisible();
    }

    await userEvent.click(canvas.getByText('Jaringan Profesional'));

    await waitFor(() => {
      const checkboxes = canvas.queryAllByRole('checkbox', { checked: true });

      expect(checkboxes).toHaveLength(0);
    });
  },
};

export const EmptyOptions: Story = {
  args: {
    values: [],
    options: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByRole('textbox')).toBeVisible();
    });

    expect(canvas.getByText('Tidak ada pilihan')).toBeVisible();
  },
};

export const LongLabels: Story = {
  args: {
    values: ['long-option-1'],
    options: [
      {
        value: 'long-option-1',
        label:
          'Ini adalah label opsi yang sangat panjang dan mungkin akan melampaui batas kontainer',
        color: 'blue',
      },
      {
        value: 'long-option-2',
        label:
          'Label opsi lain yang sangat panjang untuk menguji perilaku pembungkusan teks',
        color: 'green',
      },
      {
        value: 'short',
        label: 'Singkat',
        color: 'red',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByRole('textbox')).toBeVisible();
    });

    expect(
      canvas.getByText(
        'Ini adalah label opsi yang sangat panjang dan mungkin akan melampaui batas kontainer',
      ),
    ).toBeVisible();
    expect(canvas.getByText('Singkat')).toBeVisible();
  },
};

export const SearchFiltering: Story = {
  args: {
    values: [],
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const searchInput = canvas.getByRole('textbox');

    await userEvent.type(searchInput, 'marketing');

    await waitFor(() => {
      expect(canvas.getByText('Pemasaran Konten')).toBeVisible();
      expect(canvas.getByText('Pemasaran Viral')).toBeVisible();
    });

    expect(canvas.queryByText('Media Sosial')).not.toBeInTheDocument();
    expect(canvas.getAllByRole('checkbox')).toHaveLength(2);
  },
};

export const NoResultsFound: Story = {
  args: {
    values: [],
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const searchInput = canvas.getByRole('textbox');

    await userEvent.type(searchInput, 'xyz123');

    await waitFor(() => {
      expect(canvas.getByText('Tidak ada pilihan')).toBeVisible();
    });
  },
};

export const KeyboardNavigation: Story = {
  args: {
    values: [],
    options: priorityOptions,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const searchInput = await canvas.findByRole('textbox');

    await userEvent.click(searchInput);

    await waitFor(() => {
      expect(searchInput).toHaveFocus();
    });

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');

    const secondOption = await canvas.findByText('Sedang');
    expect(secondOption).toBeVisible();

    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(args.onOptionSelected).toHaveBeenCalledWith(['medium']);
    });
  },
};
