import { hasTokenPair } from '@/apollo/utils/hasTokenPair';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useHasAccessTokenPair = (): boolean => {
  // Subscribe to atom changes while reading cookie-first canonical source.
  useAtomStateValue(tokenPairState);

  return hasTokenPair();
};
