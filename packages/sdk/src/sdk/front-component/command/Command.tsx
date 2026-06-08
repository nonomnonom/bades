import { useEffect, useRef } from 'react';

import { unmountFrontComponent, useFrontComponentId } from '..';

export type CommandProps = {
  execute: () => void | Promise<void>;
};

export const Command = ({ execute }: CommandProps) => {
  const hasExecutedRef = useRef(false);

  const frontComponentId = useFrontComponentId();

  useEffect(() => {
    if (hasExecutedRef.current) {
      return;
    }

    hasExecutedRef.current = true;

    const run = async () => {
      await execute();

      await unmountFrontComponent();
    };

    run();
  }, [execute, frontComponentId]);

  return null;
};
