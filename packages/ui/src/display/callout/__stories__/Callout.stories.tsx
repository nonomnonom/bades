import { type Meta, type StoryObj } from '@storybook/react-vite';
import {
  CatalogDecorator,
  type CatalogStory,
  ComponentDecorator,
} from '@ui/testing';

import { Callout } from '@ui/display';
import { type CalloutVariant } from '@ui/display/callout/Callout';

const meta: Meta<typeof Callout> = {
  title: 'UI/Display/Callout',
  component: Callout,
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Default: Story = {
  args: {
    variant: 'neutral',
    title: 'Formulir ini akan muncul di proses alur kerja.',
    description:
      'Karena alur kerja ini tidak menggunakan pemicu manual, formulir tidak akan muncul di atas antarmuka. Untuk mengisinya, buka proses alur kerja yang sesuai dan lengkapi formulir di sana.',
    action: {
      label: 'Pelajari lebih lanjut',
      onClick: () => {},
    },
  },
  decorators: [ComponentDecorator],
};

export const Catalog: CatalogStory<Story, typeof Callout> = {
  args: {
    title: 'Formulir ini akan muncul di proses alur kerja.',
    description:
      'Karena alur kerja ini tidak menggunakan pemicu manual, formulir tidak akan muncul di atas antarmuka. Untuk mengisinya, buka proses alur kerja yang sesuai dan lengkapi formulir di sana.',
    action: {
      label: 'Pelajari lebih lanjut',
      onClick: () => {},
    },
  },
  argTypes: {
    variant: { control: false },
  },
  parameters: {
    catalog: {
      dimensions: [
        {
          name: 'accents',
          values: [
            'success',
            'warning',
            'error',
            'neutral',
            'info',
          ] satisfies CalloutVariant[],
          props: (variant: CalloutVariant) => ({ variant }),
        },
      ],
      options: {
        elementContainer: {
          width: 512,
        },
      },
    },
  },
  decorators: [CatalogDecorator],
};
