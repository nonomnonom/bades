import { type Meta, type StoryObj } from '@storybook/react-vite';

import { CalendarEventsCard } from '@/activities/calendar/components/CalendarEventsCard';
import { ComponentDecorator } from 'ui/testing';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';

const meta: Meta<typeof CalendarEventsCard> = {
  title: 'Modules/Activities/Calendar/CalendarEventsCard',
  component: CalendarEventsCard,
  decorators: [ComponentDecorator, SnackBarDecorator],
  parameters: {
    container: { width: 728 },
  },
};

export default meta;
type Story = StoryObj<typeof CalendarEventsCard>;

export const Default: Story = {};
