import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';
import { type Meta, type StoryObj } from '@storybook/react-vite';

import { ComponentDecorator } from 'ui/testing';
import { ComponentWithRouterDecorator } from '~/testing/decorators/ComponentWithRouterDecorator';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Navigation/Breadcrumb/Breadcrumb',
  component: Breadcrumb,
  decorators: [ComponentDecorator, ComponentWithRouterDecorator],
  args: {
    links: [
      { children: 'Objek', href: '/link-1' },
      { children: 'Perusahaan', href: '/link-2' },
      { children: 'Baru' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};
