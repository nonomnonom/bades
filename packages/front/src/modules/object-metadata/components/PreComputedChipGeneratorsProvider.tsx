import React, { useMemo } from 'react';

import { allowRequestsToFaviconServiceState } from '@/client-config/states/allowRequestsToFaviconService';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { PreComputedChipGeneratorsContext } from '@/object-metadata/contexts/PreComputedChipGeneratorsContext';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { getRecordChipGenerators } from '@/object-record/utils/getRecordChipGenerators';

export const PreComputedChipGeneratorsProvider = ({
  children,
}: React.PropsWithChildren) => {
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const allowRequestsToFaviconService = useAtomStateValue(
    allowRequestsToFaviconServiceState,
  );
  const { chipGeneratorPerObjectPerField, identifierChipGeneratorPerObject } =
    useMemo(() => {
      return getRecordChipGenerators(
        objectMetadataItems,
        allowRequestsToFaviconService,
      );
    }, [allowRequestsToFaviconService, objectMetadataItems]);

  const chipGeneratorsValue = useMemo(
    () => ({
      chipGeneratorPerObjectPerField,
      identifierChipGeneratorPerObject,
    }),
    [chipGeneratorPerObjectPerField, identifierChipGeneratorPerObject],
  );

  return (
    <>
      <PreComputedChipGeneratorsContext.Provider value={chipGeneratorsValue}>
        {children}
      </PreComputedChipGeneratorsContext.Provider>
    </>
  );
};
