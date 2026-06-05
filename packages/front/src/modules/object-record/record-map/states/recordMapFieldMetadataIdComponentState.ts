import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';
import { ViewComponentInstanceContext } from '@/views/states/contexts/ViewComponentInstanceContext';

export const recordMapFieldMetadataIdComponentState = createAtomComponentState<
  string | null
>({
  key: 'recordMapFieldMetadataIdComponentState',
  defaultValue: null,
  componentInstanceContext: ViewComponentInstanceContext,
});
