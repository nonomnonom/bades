import { clientConfigApiStatusState } from '@/client-config/states/clientConfigApiStatusState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { AppFullScreenErrorFallback } from '@/error-handler/components/AppFullScreenErrorFallback';

export const ClientConfigProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { isErrored, error } = useAtomStateValue(clientConfigApiStatusState);

  return isErrored && error instanceof Error ? (
    <AppFullScreenErrorFallback
      error={error}
      resetErrorBoundary={() => {
        window.location.reload();
      }}
      title={'Tidak dapat terhubung ke server'}
    />
  ) : (
    children
  );
};
