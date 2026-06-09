import { FullScreenContainer } from '@/ui/layout/fullscreen/components/FullScreenContainer';
import { styled } from '@linaria/react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { ComponentDecorator, ComponentWithRouterDecorator } from 'ui/testing';

const meta: Meta<typeof FullScreenContainer> = {
  title: 'UI/Layout/FullScreenContainer',
  component: FullScreenContainer,
  decorators: [ComponentDecorator, ComponentWithRouterDecorator],
};
export default meta;

type Story = StoryObj<typeof FullScreenContainer>;

const StyledContainer = styled.div`
  align-items: center;
  background-color: white;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

export const Default: Story = {
  args: {
    children: <StyledContainer>This is full-screen content</StyledContainer>,
    links: [
      {
        children: 'Layout',
        href: '/',
      },
      {
        children: 'FullScreen',
        href: '/',
      },
    ],
    exitFullScreen: () => {},
  },
  decorators: [ComponentDecorator],
};
