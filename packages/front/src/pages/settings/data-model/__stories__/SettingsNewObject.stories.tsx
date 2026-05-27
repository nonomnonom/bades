import { type Meta, type StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import {
  PageDecorator,
  type PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

import { SettingsNewObject } from '~/pages/settings/data-model/SettingsNewObject';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Settings/DataModel/SettingsNewObject',
  component: SettingsNewObject,
  decorators: [PageDecorator],
  args: {
    routePath: '/settings/objects/new',
  },
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;

export type Story = StoryObj<typeof SettingsNewObject>;

export const WithStandardSelected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Objek Baru');

    const listingInput = await canvas.findByPlaceholderText('Nama singular');
    const pluralInput = await canvas.findByPlaceholderText('Nama plural');
    const descriptionInput = await canvas.findByPlaceholderText(
      'Tulis deskripsi',
    );
    const saveButton = await canvas.findByText('Simpan');
    await userEvent.type(listingInput, 'Perusahaan');
    await userEvent.type(pluralInput, ' daftar');
    await userEvent.type(descriptionInput, 'Deskripsi percobaan');

    await userEvent.click(saveButton);
  },
};
