import { styled } from '@linaria/react';
import { type Meta, type StoryObj } from '@storybook/react-vite';

import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { IconSearch } from 'ui/display';
import { CatalogDecorator, type CatalogStory } from 'ui/testing';
import { getOsControlSymbol } from 'ui/utilities';
import { ComponentWithRouterDecorator } from '~/testing/decorators/ComponentWithRouterDecorator';
import { MemoryRouterDecorator } from '~/testing/decorators/MemoryRouterDecorator';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const meta: Meta<typeof NavigationDrawerItem> = {
  title: 'UI/Navigation/NavigationDrawer/NavigationDrawerItem',
  component: NavigationDrawerItem,
  args: {
    label: 'Cari',
    Icon: IconSearch,
  },
  argTypes: { Icon: { control: false } },
};

export default meta;
type Story = StoryObj<typeof NavigationDrawerItem>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <StyledContainer>
        <Story />
      </StyledContainer>
    ),
    ComponentWithRouterDecorator,
  ],
};

export const Breadcrumb: Story = {
  decorators: [
    (Story) => (
      <StyledContainer>
        <h1>Breadcrumb</h1>
        <Story
          args={{
            indentationLevel: 1,
            label: 'Cari',
            Icon: IconSearch,
          }}
        />
        <Story
          args={{
            indentationLevel: 2,
            subItemState: 'intermediate-before-selected',
            label: 'Awal tidak dipilih',
            Icon: IconSearch,
          }}
        />
        <Story
          args={{
            indentationLevel: 2,
            subItemState: 'intermediate-before-selected',
            label: 'Sebelum dipilih',
            Icon: IconSearch,
          }}
        />
        <Story
          args={{
            indentationLevel: 2,
            subItemState: 'intermediate-selected',
            label: 'Dipilih',
            Icon: IconSearch,
          }}
        />
        <Story
          args={{
            indentationLevel: 2,
            subItemState: 'intermediate-after-selected',
            label: 'Setelah dipilih',
            Icon: IconSearch,
          }}
        />
        <Story
          args={{
            indentationLevel: 2,
            subItemState: 'last-not-selected',
            label: 'Terakhir tidak dipilih',
            Icon: IconSearch,
          }}
        />
      </StyledContainer>
    ),
    ComponentWithRouterDecorator,
  ],
};

export const NewPill: Story = {
  decorators: [
    (Story) => (
      <StyledContainer>
        <h1>Contoh Label Baru</h1>
        <Story
          args={{
            label: 'Fitur Baru',
            Icon: IconSearch,
            modifier: 'new',
          }}
        />
        <Story
          args={{
            label: 'Fitur dengan Pintasan Papan Ketik',
            Icon: IconSearch,
            modifier: { keyboard: [getOsControlSymbol(), 'N'] },
          }}
        />
      </StyledContainer>
    ),
    ComponentWithRouterDecorator,
  ],
};

export const BreadcrumbCatalog: CatalogStory<
  Story,
  typeof NavigationDrawerItem
> = {
  decorators: [
    (Story) => (
      <StyledContainer>
        <Story />
      </StyledContainer>
    ),
    CatalogDecorator,
    MemoryRouterDecorator,
  ],
  args: {
    indentationLevel: 2,
  },
  parameters: {
    pseudo: { hover: ['.hover'] },
    catalog: {
      dimensions: [
        {
          name: 'subItemState',
          values: [
            'Sebelum dipilih',
            'Intermediate dipilih',
            'Setelah dipilih',
            'Terakhir tidak dipilih',
            'Terakhir dipilih',
          ],
          props: (state: string) => {
            switch (state) {
              case 'Sebelum dipilih':
                return { subItemState: 'intermediate-before-selected' };
              case 'Intermediate dipilih':
                return { subItemState: 'intermediate-selected' };
              case 'Setelah dipilih':
                return { subItemState: 'intermediate-after-selected' };
              case 'Terakhir tidak dipilih':
                return { subItemState: 'last-not-selected' };
              case 'Terakhir dipilih':
                return { subItemState: 'last-selected' };
              default:
                throw new Error(`Unknown state: ${state}`);
            }
          },
        },
      ],
    },
  },
};

export const Catalog: CatalogStory<Story, typeof NavigationDrawerItem> = {
  decorators: [
    (Story) => (
      <StyledContainer>
        <Story />
      </StyledContainer>
    ),
    CatalogDecorator,
    MemoryRouterDecorator,
  ],
  parameters: {
    pseudo: { hover: ['.hover'] },
    catalog: {
      dimensions: [
        {
          name: 'active',
          values: [true, false],
          props: (active: boolean) => ({ active }),
          labels: (active: boolean) => (active ? 'Aktif' : 'Tidak Aktif'),
        },
        {
          name: 'states',
          values: ['Default', 'Hover'],
          props: (state: string) => ({
            className: state === 'Hover' ? 'hover' : undefined,
          }),
        },
        {
          name: 'adornments',
          values: ['Tanpa Modifikasi', 'Segera', 'Baru', 'Tombol Papan Ketik'],
          props: (adornmentName: string) =>
            adornmentName === 'Soon'
              ? { modifier: 'soon' }
              : adornmentName === 'New'
                ? { modifier: 'new' }
                : adornmentName === 'Keyboard Keys'
                  ? {
                      modifier: {
                        keyboard: [getOsControlSymbol(), 'K'],
                      },
                    }
                  : {},
        },
      ],
    },
  },
};
