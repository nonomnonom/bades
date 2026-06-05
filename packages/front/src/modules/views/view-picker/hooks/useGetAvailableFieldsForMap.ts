import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { navigationMemorizedUrlState } from '@/ui/navigation/states/navigationMemorizedUrlState';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { viewObjectMetadataIdComponentState } from '@/views/states/viewObjectMetadataIdComponentState';
import { FieldMetadataType, SettingsPath } from 'shared/types';
import { isDefined } from 'shared/utils';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const useGetAvailableFieldsForMap = () => {
  const viewObjectMetadataId = useAtomComponentStateValue(
    viewObjectMetadataIdComponentState,
  );
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const setNavigationMemorizedUrl = useSetAtomState(
    navigationMemorizedUrlState,
  );
  const location = useLocation();

  const objectMetadataItem = objectMetadataItems.find(
    (objectMetadata) => objectMetadata.id === viewObjectMetadataId,
  );

  const availableFieldsForMap =
    objectMetadataItem?.readableFields.filter(
      (field) => field.type === FieldMetadataType.ADDRESS && field.isActive,
    ) ?? [];

  const navigate = useNavigateSettings();

  const navigateToAddressFieldSettings = useCallback(() => {
    setNavigationMemorizedUrl(location.pathname + location.search);

    if (isDefined(objectMetadataItem?.namePlural)) {
      navigate(
        SettingsPath.ObjectNewFieldConfigure,
        {
          objectNamePlural: objectMetadataItem.namePlural,
        },
        {
          fieldType: FieldMetadataType.ADDRESS,
        },
      );
    } else {
      navigate(SettingsPath.Objects);
    }
  }, [
    setNavigationMemorizedUrl,
    location.pathname,
    location.search,
    objectMetadataItem,
    navigate,
  ]);

  return {
    availableFieldsForMap,
    navigateToAddressFieldSettings,
  };
};
