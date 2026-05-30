import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const recordMapFieldMetadataIdState = createAtomState<string | null>({
  key: 'recordMapFieldMetadataIdState',
  defaultValue: null,
});
