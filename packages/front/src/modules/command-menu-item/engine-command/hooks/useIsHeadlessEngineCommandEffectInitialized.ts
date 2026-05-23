import { useRef } from 'react';

export const useIsHeadlessEngineCommandEffectInitialized = () => {
  // eslint-disable-next-line bades/no-state-useref
  const isInitializedRef = useRef(false);

  const setIsInitialized = (value: boolean) => {
    isInitializedRef.current = value;
  };

  return { isInitializedRef, setIsInitialized };
};
