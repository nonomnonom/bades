import {
  type Decorator,
  type Meta,
  type StoryObj,
} from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { isModalOpenedComponentState } from '@/ui/layout/modal/states/isModalOpenedComponentState';
import { focusStackState } from '@/ui/utilities/focus/states/focusStackState';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { ComponentDecorator } from 'ui/testing';
import { RootDecorator } from '~/testing/decorators/RootDecorator';
import { sleep } from '~/utils/sleep';

const JotaiInitDecorator: Decorator = (Story) => {
  jotaiStore.set(
    isModalOpenedComponentState.atomFamily({
      instanceId: 'confirmation-modal',
    }),
    true,
  );
  jotaiStore.set(focusStackState.atom, [
    {
      focusId: 'confirmation-modal',
      componentInstance: {
        componentType: FocusComponentType.MODAL,
        componentInstanceId: 'confirmation-modal',
      },
      globalHotkeysConfig: {
        enableGlobalHotkeysWithModifiers: true,
        enableGlobalHotkeysConflictingWithKeyboard: true,
      },
    },
  ]);
  return <Story />;
};

const meta: Meta<typeof ConfirmationModal> = {
  title: 'UI/Layout/Modal/ConfirmationModal',
  component: ConfirmationModal,
  decorators: [JotaiInitDecorator, RootDecorator, ComponentDecorator],
  parameters: {
    disableHotkeyInitialization: true,
  },
};
export default meta;

type Story = StoryObj<typeof ConfirmationModal>;

const closeMock = fn();
const confirmMock = fn();

export const Default: Story = {
  args: {
    modalInstanceId: 'confirmation-modal',
    title: 'Pariatur labore.',
    subtitle: 'Velit dolore aliquip laborum occaecat fugiat.',
    confirmButtonText: 'Hapus',
    onConfirmClick: fn(),
  },
};

export const InputConfirmation: Story = {
  args: {
    confirmationValue: 'email@test.dev',
    confirmationPlaceholder: 'email@test.dev',
    ...Default.args,
  },
};

export const CloseOnEscape: Story = {
  args: {
    modalInstanceId: 'confirmation-modal',
    title: 'Tes Tombol Escape',
    subtitle: 'Modal ini harus menutup saat menekan tombol Escape.',
    confirmButtonText: 'Konfirmasi',
    onClose: closeMock,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await body.findByText('Tes Tombol Escape');

    closeMock.mockClear();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalledTimes(1);
    });
  },
};

export const CloseOnClickOutside: Story = {
  args: {
    modalInstanceId: 'confirmation-modal',
    title: 'Tes Klik di Luar',
    subtitle: 'Modal ini harus menutup saat mengeklik di luar area modal.',
    confirmButtonText: 'Konfirmasi',
    onClose: closeMock,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await body.findByText('Tes Klik di Luar');

    const backdrop = await body.findByTestId('modal-backdrop');

    // We need to wait for the outside click listener to be registered
    await sleep(100);

    await userEvent.click(backdrop);

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalledTimes(1);
    });
  },
};

export const ConfirmWithEnterKey: Story = {
  args: {
    modalInstanceId: 'confirmation-modal',
    title: 'Tes Tombol Enter',
    subtitle: 'Modal ini harus mengkonfirmasi saat menekan tombol Enter.',
    confirmButtonText: 'Konfirmasi',
    onConfirmClick: confirmMock,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await body.findByText('Tes Tombol Enter');

    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(confirmMock).toHaveBeenCalledTimes(1);
    });
  },
};

export const CancelButtonClick: Story = {
  args: {
    modalInstanceId: 'confirmation-modal',
    title: 'Tes Tombol Batal',
    subtitle: 'Menekan tombol Batal harus menutup modal.',
    confirmButtonText: 'Konfirmasi',
    onClose: closeMock,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await body.findByText('Tes Tombol Batal');

    const cancelButton = await body.findByRole('button', {
      name: /Batal/,
    });
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalledTimes(1);
    });
  },
};

export const ConfirmButtonClick: Story = {
  args: {
    modalInstanceId: 'confirmation-modal',
    title: 'Tes Tombol Konfirmasi',
    subtitle: 'Menekan tombol Konfirmasi harus memicu tindakan konfirmasi.',
    confirmButtonText: 'Konfirmasi',
    onConfirmClick: confirmMock,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await body.findByText('Tes Tombol Konfirmasi');

    const confirmButton = await body.findByRole('button', {
      name: /Konfirmasi/,
    });

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(confirmMock).toHaveBeenCalledTimes(1);
    });
  },
};
