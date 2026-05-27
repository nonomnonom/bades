import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import {
  PageDecorator,
  type PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

import { SettingsSubdomainPage } from '~/pages/settings/domains/SettingsSubdomainPage';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Settings/Domains/SettingsSubdomain',
  component: SettingsSubdomainPage,
  decorators: [PageDecorator],
  args: { routePath: '/settings/domains/subdomain' },
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;

export type Story = StoryObj<typeof SettingsSubdomainPage>;

export const Default: Story = {};

export const TooShortSubdomain: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = await canvas.findByRole('textbox', {}, { timeout: 5000 });

    await userEvent.clear(input);
    await userEvent.type(input, 'ab');

    const errorMessage = await canvas.findByText(
      'Subdomain minimal 3 karakter',
    );

    await expect(errorMessage).toBeVisible();

    const saveButton = canvas.getByText('Simpan');

    await expect(saveButton.closest('button')).toBeDisabled();
  },
};

export const InvalidCharacters: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = await canvas.findByRole('textbox', {}, { timeout: 5000 });

    await userEvent.clear(input);
    await userEvent.type(input, 'api-test');

    const errorMessage = await canvas.findByText(
      'Gunakan huruf, angka, dan strip saja. Mulai dan akhiri dengan huruf atau angka',
    );

    await expect(errorMessage).toBeVisible();

    const saveButton = canvas.getByText('Simpan');

    await expect(saveButton.closest('button')).toBeDisabled();
  },
};

export const ReservedSubdomain: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = await canvas.findByRole('textbox', {}, { timeout: 5000 });

    await userEvent.clear(input);
    await userEvent.type(input, 'api');

    const errorMessage = await canvas.findByText('Subdomain ini sudah dipesan');

    await expect(errorMessage).toBeVisible();

    const saveButton = canvas.getByText('Simpan');

    await expect(saveButton.closest('button')).toBeDisabled();
  },
};

export const ValidSubdomain: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = await canvas.findByRole('textbox', {}, { timeout: 5000 });

    await userEvent.clear(input);
    await userEvent.type(input, 'my-workspace');

    const saveButton = canvas.getByText('Simpan');

    await expect(saveButton.closest('button')).toBeEnabled();
  },
};
