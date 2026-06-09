import { useEffect, useState } from 'react';

import { isDefined } from 'shared/utils';

export const useHTMLElementByIdWhenAvailable = (id: string) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isObserving, setIsObserving] = useState(false);

  useEffect(() => {
    if (isObserving || isDefined(element)) {
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
        setIsObserving(false);
        mutationObserver.disconnect();
      }
    });

    setIsObserving(true);
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
