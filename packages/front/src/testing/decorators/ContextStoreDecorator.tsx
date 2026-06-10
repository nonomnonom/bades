import { type Decorator } from '@storybook/react-vite';

import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { isUndefined } from '@sniptt/guards';
import { getMockObjectMetadataItemOrThrow } from '~/testing/utils/getMockObjectMetadataItemOrThrow';

export const ContextStoreDecorator: Decorator = (Story, context) => {
  const { contextStore } = context.parameters;

  let componentInstanceId = contextStore?.componentInstanceId;

  if (isUndefined(componentInstanceId)) {
    componentInstanceId = MAIN_CONTEXT_STORE_INSTANCE_ID;
  }

  const setContextStoreCurrentObjectMetadataItemId = useSetAtomComponentState(
    contextStoreCurrentObjectMetadataItemIdComponentState,
    componentInstanceId,
  );

  const objectMetadataItem = getMockObjectMetadataItemOrThrow('keluarga');
  setContextStoreCurrentObjectMetadataItemId(objectMetadataItem.id);

  return (
    <ContextStoreComponentInstanceContext.Provider
      value={{ instanceId: componentInstanceId }}
    >
      <Story />
    </ContextStoreComponentInstanceContext.Provider>
  );
};
