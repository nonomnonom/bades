import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';

import {
  SnackBar,
  SnackBarVariant,
} from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import {
  CatalogDecorator,
  type CatalogStory,
  ComponentDecorator,
} from 'ui/testing';

const meta: Meta<typeof SnackBar> = {
  title: 'UI/Feedback/SnackBarManager/SnackBar',
  component: SnackBar,
  decorators: [SnackBarDecorator],
  argTypes: {
    className: { control: false },
    icon: { control: false },
  },
  args: {
    message: 'Lorem ipsum',
    detailedMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros tincidunt lacinia.',
    onCancel: undefined,
    onClose: fn(),
    role: 'status',
    variant: SnackBarVariant.Default,
  },
};

export default meta;
type Story = StoryObj<typeof SnackBar>;

export const Default: Story = {
  decorators: [ComponentDecorator],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const WithBottomButton: Story = {
  args: {
    variant: SnackBarVariant.Error,
    message: 'Terjadi kesalahan',
    detailedMessage: 'Kesalahan saat mengambil data...',
    buttonLabel: 'Buka Rekaman',
    buttonOnClick: fn(),
  },
  decorators: [ComponentDecorator],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const SuccessWithButton: Story = {
  args: {
    variant: SnackBarVariant.Success,
    message: 'Rekaman berhasil dibuat',
    buttonLabel: 'Lihat Rekaman',
    buttonOnClick: fn(),
  },
  decorators: [ComponentDecorator],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Catalog: CatalogStory<Story, typeof SnackBar> = {
  args: {
    onCancel: fn(),
  },
  decorators: [CatalogDecorator],
  parameters: {
    catalog: {
      dimensions: [
        {
          name: 'progress',
          values: [0, 75, 100],
          props: (progress) => ({ progress }),
        },
        {
          name: 'variants',
          values: Object.values(SnackBarVariant),
          props: (variant: SnackBarVariant) => ({ variant }),
        },
      ],
    },
  },
};

export const CatalogWithButton: CatalogStory<Story, typeof SnackBar> = {
  args: {
    buttonLabel: 'Buka Rekaman',
    buttonOnClick: fn(),
  },
  decorators: [CatalogDecorator],
  parameters: {
    catalog: {
      dimensions: [
        {
          name: 'variants',
          values: Object.values(SnackBarVariant),
          props: (variant: SnackBarVariant) => ({ variant }),
        },
      ],
    },
  },
};
