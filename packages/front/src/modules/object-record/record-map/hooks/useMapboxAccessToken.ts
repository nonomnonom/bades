import { clientConfigApiStatusState } from '@/client-config/states/clientConfigApiStatusState';
import { mapboxState } from '@/client-config/states/mapboxState';
import { isValidMapboxAccessToken } from '@/object-record/record-map/utils/getMapboxAccessToken';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useMapboxAccessToken = () => {
  const mapbox = useAtomStateValue(mapboxState);
  const clientConfigApiStatus = useAtomStateValue(clientConfigApiStatusState);
  const accessToken = mapbox?.accessToken ?? '';

  return {
    accessToken,
    hasValidAccessToken: isValidMapboxAccessToken(accessToken),
    isClientConfigLoaded: clientConfigApiStatus.isLoadedOnce,
  };
};
