import { FrontComponentInstanceContext } from '@/front-components/states/contexts/FrontComponentInstanceContext';
import { useMemo } from 'react';

type FrontComponentRendererProviderProps = {
  frontComponentId: string;
  children: React.ReactNode;
};

export const FrontComponentRendererProvider = ({
  frontComponentId,
  children,
}: FrontComponentRendererProviderProps) => {
  const value = useMemo(
    () => ({ instanceId: frontComponentId }),
    [frontComponentId],
  );

  return (
    <FrontComponentInstanceContext.Provider
      value={value}
    >
      {children}
    </FrontComponentInstanceContext.Provider>
  );
};
