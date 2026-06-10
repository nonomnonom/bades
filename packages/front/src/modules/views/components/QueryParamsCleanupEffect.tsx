import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useHasFiltersInQueryParams } from '@/views/hooks/internal/useHasFiltersInQueryParams';
import { useSortsFromQueryParams } from '@/views/hooks/internal/useSortsFromQueryParams';
import { useGetCurrentViewOnly } from '@/views/hooks/useGetCurrentViewOnly';

export const QueryParamsCleanupEffect = () => {
  const { hasFiltersQueryParams } = useHasFiltersInQueryParams();
  const { hasSortsQueryParams, objectMetadataItem } = useSortsFromQueryParams();

  const { currentView } = useGetCurrentViewOnly();

  const [searchParams, setSearchParams] = useSearchParams();

  const hasCleanedQueryParamsRef = useRef(false);

  const currentViewObjectMetadataItemIsDifferentFromURLObjectMetadataItem =
    currentView?.objectMetadataId !== objectMetadataItem.id;

  useEffect(() => {
    if (
      currentViewObjectMetadataItemIsDifferentFromURLObjectMetadataItem ||
      hasCleanedQueryParamsRef.current
    ) {
      return;
    }

    if (!hasFiltersQueryParams && !hasSortsQueryParams) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    Array.from(newParams.keys()).forEach((key) => {
      if (
        key.startsWith('filter[') ||
        key.startsWith('filterGroup[') ||
        key.startsWith('sort[')
      ) {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams, { replace: true });
    hasCleanedQueryParamsRef.current = true;
  }, [
    currentViewObjectMetadataItemIsDifferentFromURLObjectMetadataItem,
    hasFiltersQueryParams,
    hasSortsQueryParams,
    searchParams,
    setSearchParams,
  ]);

  return null;
};
