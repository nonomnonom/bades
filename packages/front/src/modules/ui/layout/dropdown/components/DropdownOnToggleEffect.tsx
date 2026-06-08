import { useEffect, useRef } from 'react';

import { isDropdownOpenComponentState } from '@/ui/layout/dropdown/states/isDropdownOpenComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';

export const DropdownOnToggleEffect = ({
  onDropdownClose,
  onDropdownOpen,
}: {
  onDropdownClose?: () => void;
  onDropdownOpen?: () => void;
}) => {
  const isDropdownOpen = useAtomComponentStateValue(
    isDropdownOpenComponentState,
  );

  const prevIsDropdownOpenRef = useRef(isDropdownOpen);

  useEffect(() => {
    const prevOpen = prevIsDropdownOpenRef.current;

    prevIsDropdownOpenRef.current = isDropdownOpen;

    if (isDropdownOpen && !prevOpen) {
      onDropdownOpen?.();
    }

    if (!isDropdownOpen && prevOpen) {
      onDropdownClose?.();
    }
  }, [isDropdownOpen, onDropdownClose, onDropdownOpen]);

  return null;
};
