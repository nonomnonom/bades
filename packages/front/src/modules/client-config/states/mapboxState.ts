import { type Mapbox } from '~/generated-metadata/graphql';
import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const mapboxState = createAtomState<Mapbox | null>({
  key: 'mapboxState',
  defaultValue: null,
});
