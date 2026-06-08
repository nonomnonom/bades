import { useEffect, useRef, useState } from 'react';

import { isDefined } from 'shared/utils';

export const useHTMLElementByIdWhenAvailable = (id: string) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const isObservingRef = useRef(false);

  useEffect(() => {
    if (isObservingRef.current || isDefined(element)) {
      return;
    }

    const elementFoundBeforeObservingMutation = document.getElementById(id);

    if (isDefined(elementFoundBeforeObservingMutation)) {
      setElement(elementFoundBeforeObservingMutation);

      return;
    }

    const mutationObserver = new MutationObserver(() => {
      const elementObserved = document.getElementById(id);

      if (isDefined(elementObserved)) {
        setElement(elementObserved);
        isObservingRef.current = false;
        mutationObserver.disconnect();
      }
    });

    isObservingRef.current = true;
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [element, id]);

  return {
    element,
  };
};
