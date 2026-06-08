import { useEffect, useRef } from 'react';

import {
  openCommandConfirmationModal,
  unmountFrontComponent,
  useFrontComponentId,
  type CommandConfirmationModalAccent,
} from '..';

export type CommandModalProps = {
  title: string;
  subtitle: string;
  execute: () => void | Promise<void>;
  confirmButtonText?: string;
  confirmButtonAccent?: CommandConfirmationModalAccent;
};

export const CommandModal = ({
  title,
  subtitle,
  execute,
  confirmButtonText,
  confirmButtonAccent,
}: CommandModalProps) => {
  const hasExecutedRef = useRef(false);

  const frontComponentId = useFrontComponentId();

  useEffect(() => {
    if (hasExecutedRef.current) {
      return;
    }

    hasExecutedRef.current = true;

    const run = async () => {
      const commandConfirmationModalResult = await openCommandConfirmationModal(
        {
          title,
          subtitle,
          confirmButtonText,
          confirmButtonAccent,
        },
      );

      if (commandConfirmationModalResult === 'confirm') {
        await execute();
      }

      await unmountFrontComponent();
    };

    run();
  }, [
    title,
    subtitle,
    execute,
    confirmButtonText,
    confirmButtonAccent,
    frontComponentId,
  ]);

  return null;
};
