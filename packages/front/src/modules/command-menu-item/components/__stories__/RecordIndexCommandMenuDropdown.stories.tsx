import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Provider as JotaiProvider } from 'jotai';
import { expect, within } from 'storybook/test';

import { RecordIndexCommandMenuDropdown } from '@/command-menu-item/components/RecordIndexCommandMenuDropdown';
import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { createMockCommandMenuItems } from '@/command-menu-item/mock/command-menu-items.mock';
import { recordIndexCommandMenuDropdownPositionComponentState } from '@/command-menu-item/states/recordIndexCommandMenuDropdownPositionComponentState';
import { CommandMenuComponentInstanceContext } from '@/command-menu/states/contexts/CommandMenuComponentInstanceContext';

import { EMPTY_COMMAND_MENU_CONTEXT_API } from '@/command-menu-item/constants/EmptyCommandMenuContextApi';
import { isDropdownOpenComponentState } from '@/ui/layout/dropdown/states/isDropdownOpenComponentState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { RouterDecorator } from 'ui/testing';
import { ContextStoreDecorator } from '~/testing/decorators/ContextStoreDecorator';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';

const meta: Meta<typeof RecordIndexCommandMenuDropdown> = {
  title: 'Modules/CommandMenu/RecordIndexCommandMenuDropdown',
  component: RecordIndexCommandMenuDropdown,
  decorators: [
    (Story) => {
      jotaiStore.set(
        isDropdownOpenComponentState.atomFamily({
          instanceId: 'command-menu-dropdown-story-command-menu',
        }),
        true,
      );
      jotaiStore.set(
        recordIndexCommandMenuDropdownPositionComponentState.atomFamily({
          instanceId: 'command-menu-dropdown-story',
        }),
        { x: 10, y: 10 },
      );

      return (
        <JotaiProvider store={jotaiStore}>
          <CommandMenuComponentInstanceContext.Provider
            value={{ instanceId: 'story-command-menu' }}
          >
            <CommandMenuContext.Provider
              value={{
                displayType: 'dropdownItem',
                containerType: 'index-page-dropdown',
                commandMenuItems: createMockCommandMenuItems(),
                commandMenuContextApi: EMPTY_COMMAND_MENU_CONTEXT_API,
                isInPreviewMode: false,
              }}
            >
              <Story />
            </CommandMenuContext.Provider>
          </CommandMenuComponentInstanceContext.Provider>
        </JotaiProvider>
      );
    },
    ContextStoreDecorator,
    ObjectMetadataItemsDecorator,
    SnackBarDecorator,
    RouterDecorator,
  ],
};

export default meta;

type Story = StoryObj<typeof RecordIndexCommandMenuDropdown>;

export const Default: Story = {
  args: {
    commandMenuId: 'story',
  },
};

export const WithInteractions: Story = {
  args: {
    commandMenuId: 'story',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    const deleteButton = await canvas.findByText('Hapus');
    const addToFavoritesButton = await canvas.findByText('Tambah ke favorit');
    const exportButton = await canvas.findByText('Ekspor');
    const moreActionsButton = await canvas.findByText('Opsi');

    expect(deleteButton).toBeInTheDocument();
    expect(addToFavoritesButton).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();
    expect(moreActionsButton).toBeInTheDocument();
  },
};
