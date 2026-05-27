import {
  type Decorator,
  type Meta,
  type StoryObj,
} from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { ModalStatefulWrapper } from '@/ui/layout/modal/components/ModalStatefulWrapper';
import { isModalOpenedComponentState } from '@/ui/layout/modal/states/isModalOpenedComponentState';
import { focusStackState } from '@/ui/utilities/focus/states/focusStackState';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { ModalContent, ModalFooter, ModalHeader } from 'ui/layout';
import { ComponentDecorator } from 'ui/testing';
import { RootDecorator } from '~/testing/decorators/RootDecorator';
import { sleep } from '~/utils/sleep';

const JotaiInitDecorator: Decorator = (Story) => {
  jotaiStore.set(
    isModalOpenedComponentState.atomFamily({
      instanceId: 'modal-id',
    }),
    true,
  );
  jotaiStore.set(focusStackState.atom, [
    {
      focusId: 'modal-id',
      componentInstance: {
        componentType: FocusComponentType.MODAL,
        componentInstanceId: 'modal-id',
      },
      globalHotkeysConfig: {
        enableGlobalHotkeysWithModifiers: true,
        enableGlobalHotkeysConflictingWithKeyboard: true,
      },
    },
  ]);
  return <Story />;
};

const meta: Meta<typeof ModalStatefulWrapper> = {
  title: 'UI/Layout/Modal/ModalStatefulWrapper',
  component: ModalStatefulWrapper,
  decorators: [JotaiInitDecorator, RootDecorator, ComponentDecorator],
  parameters: {
    disableHotkeyInitialization: true,
  },
};

export default meta;
type Story = StoryObj<typeof ModalStatefulWrapper>;

const closeMock = fn();

export const Default: Story = {
  args: {
    modalInstanceId: 'modal-id',
    size: 'medium',
    padding: 'medium',
    children: (
      <>
        <ModalHeader>Tetap Terhubung</ModalHeader>
        <ModalContent>
          Ini adalah formulir newsletter sederhana, jadi jangan repot-repot
          mengujinya. Bukan berarti saya berharap Anda akan melakukannya. :)
        </ModalContent>
        <ModalFooter>
          Dengan menggunakan Bades, Anda memilih pengalaman SID terbaik yang
          pernah ada.
        </ModalFooter>
      </>
    ),
  },
};

export const CloseClosableModalOnClickOutside: Story = {
  args: {
    modalInstanceId: 'modal-id',
    size: 'medium',
    padding: 'medium',
    isClosable: true,
    onClose: closeMock,
    children: (
      <>
        <ModalHeader>Tes Klik di Luar</ModalHeader>
        <ModalContent>
          Modal ini harus menutup saat mengeklik di luar area modal.
        </ModalContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Tes Klik di Luar');

    const backdrop = await canvas.findByTestId('modal-backdrop');
    await sleep(100);
    await userEvent.click(backdrop);

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalledTimes(1);
    });
  },
};

export const CloseClosableModalOnEscape: Story = {
  args: {
    modalInstanceId: 'modal-id',
    size: 'medium',
    padding: 'medium',
    isClosable: true,
    onClose: closeMock,
    children: (
      <>
        <ModalHeader>Tes Tombol Escape</ModalHeader>
        <ModalContent>
          Modal ini harus menutup saat menekan tombol Escape.
        </ModalContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Tes Tombol Escape');

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalledTimes(1);
    });
  },
};
