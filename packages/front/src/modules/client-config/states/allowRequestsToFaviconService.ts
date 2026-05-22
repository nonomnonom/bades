import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const allowRequestsToFaviconServiceState = createAtomState<boolean>({
  key: 'allowRequestsToFaviconService',
  defaultValue: true,
});
