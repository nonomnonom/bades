import { SCROLL_RESTORATION_TOP_THRESHOLD_PX } from '@/ui/utilities/scroll/constants/ScrollRestorationTopThreshold';
import { scrollWrapperScrollTopComponentState } from '@/ui/utilities/scroll/states/scrollWrapperScrollTopComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { isDefined } from 'shared/utils';

export const useScrollRestoration = (componentInstanceId: string) => {
  const location = useLocation();
  const storageKey = `scroll-${location.pathname}`;
  const isRestoringRef = useRef(false);

  const scrollWrapperScrollTop = useAtomComponentStateValue(
    scrollWrapperScrollTopComponentState,
    componentInstanceId,
  );

  const restoreScrollPosition = useCallback(
    (position: number, elementId: string) => {
      const attemptRestore = () => {
        const element = document.getElementById(elementId);

        if (!isDefined(element)) {
          requestAnimationFrame(attemptRestore);
          return;
        }

        const isScrollable = element.scrollHeight > element.clientHeight;
        if (!isScrollable) {
          requestAnimationFrame(attemptRestore);
          return;
        }

        element.scrollTo({ top: position });

        requestAnimationFrame(() => {
          isRestoringRef.current = false;
        });
      };

      requestAnimationFrame(attemptRestore);
    },
    [],
  );

  useEffect(() => {
    if (isRestoringRef.current) return;

    if (scrollWrapperScrollTop <= SCROLL_RESTORATION_TOP_THRESHOLD_PX) {
      sessionStorage.removeItem(storageKey);
      return;
    }

    sessionStorage.setItem(storageKey, scrollWrapperScrollTop.toString());
  }, [scrollWrapperScrollTop, storageKey]);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(storageKey);
    const expectedElementId = `scroll-wrapper-${componentInstanceId}`;

    if (!isDefined(savedPosition)) {
      return;
    }

    const position = parseInt(savedPosition, 10);

    if (position <= 0) {
      return;
    }

    isRestoringRef.current = true;
    restoreScrollPosition(position, expectedElementId);
  }, [
    location.pathname,
    storageKey,
    componentInstanceId,
    restoreScrollPosition,
  ]);
};
