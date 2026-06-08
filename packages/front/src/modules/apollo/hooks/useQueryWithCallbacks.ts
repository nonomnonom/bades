import {
  NetworkStatus,
  type OperationVariables,
  type TypedDocumentNode,
} from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect, useRef, useState } from 'react';

import { isDefined } from 'shared/utils';

export type UseQueryWithCallbacksOptions<
  TData,
  TVariables extends OperationVariables,
> = useQuery.Options<TData, TVariables> & {
  onFirstLoad?: (data: TData) => void;
  onSubsequentLoad?: (data: TData) => void;
  onDataLoaded?: (data: TData) => void;
  onLoadingChange?: (loading: boolean) => void;
};

export const useQueryWithCallbacks = <
  TData,
  TVariables extends OperationVariables,
>(
  document: TypedDocumentNode<TData, TVariables>,
  options: UseQueryWithCallbacksOptions<TData, TVariables>,
) => {
  const {
    onFirstLoad,
    onSubsequentLoad,
    onDataLoaded,
    onLoadingChange,
    ...queryOptions
  } = options;

  const { networkStatus, data, loading, refetch } = useQuery(document, {
    ...queryOptions,
    notifyOnNetworkStatusChange: true,
  } as useQuery.Options<TData, TVariables>);

  const variablesString = JSON.stringify(queryOptions.variables);

  const lastProcessedVariablesRef = useRef<string | null>(null);
  const hasProcessedCurrentFetchCycleRef = useRef(false);
  const hasEverLoadedRef = useRef(false);

  useEffect(() => {
    if (networkStatus !== NetworkStatus.ready) {
      hasProcessedCurrentFetchCycleRef.current = false;
      return;
    }

    if (!isDefined(data)) {
      return;
    }

    const variablesChanged = variablesString !== lastProcessedVariablesRef.current;

    if (hasProcessedCurrentFetchCycleRef.current && !variablesChanged) {
      return;
    }

    hasProcessedCurrentFetchCycleRef.current = true;
    lastProcessedVariablesRef.current = variablesString;

    const isFirstLoad = !hasEverLoadedRef.current;

    hasEverLoadedRef.current = true;

    const typedData = data as TData;

    onDataLoaded?.(typedData);

    if (isFirstLoad) {
      onFirstLoad?.(typedData);
    } else {
      onSubsequentLoad?.(typedData);
    }
  }, [
    networkStatus,
    data,
    variablesString,
    onFirstLoad,
    onSubsequentLoad,
    onDataLoaded,
  ]);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  return { refetch };
};
