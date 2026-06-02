import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface NetworkStatusContextValue {
  isOnline: boolean;
}

const NetworkStatusContext = createContext<NetworkStatusContextValue>({
  isOnline: true,
});

export const useNetworkStatus = () => useContext(NetworkStatusContext);

interface NetworkStatusProviderProps {
  children: React.ReactNode;
  /** Custom banner component to show when offline */
  banner?: React.ReactNode;
}

export const NetworkStatusProvider = ({
  children,
  banner,
}: NetworkStatusProviderProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>
      {children}
      {!isOnline && banner}
    </NetworkStatusContext.Provider>
  );
};
