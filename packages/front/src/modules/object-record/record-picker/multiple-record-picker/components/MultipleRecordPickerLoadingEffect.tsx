import { multipleRecordPickerIsFetchingMoreComponentState } from '@/object-record/record-picker/multiple-record-picker/states/multipleRecordPickerIsFetchingMoreComponentState';
import { multipleRecordPickerIsLoadingComponentState } from '@/object-record/record-picker/multiple-record-picker/states/multipleRecordPickerIsLoadingComponentState';
import { multipleRecordPickerShouldShowSkeletonComponentState } from '@/object-record/record-picker/multiple-record-picker/states/multipleRecordPickerShouldShowSkeletonComponentState';
import { useAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const MultipleRecordPickerLoadingEffect = () => {
  const previousLoadingRef = useRef(false);

  const multipleRecordPickerIsLoading = useAtomComponentStateValue(
    multipleRecordPickerIsLoadingComponentState,
  );

  const setMultipleRecordPickerShouldShowSkeleton = useSetAtomComponentState(
    multipleRecordPickerShouldShowSkeletonComponentState,
  );

  const [multipleRecordPickerIsFetchingMore] = useAtomComponentState(
    multipleRecordPickerIsFetchingMoreComponentState,
  );

  const debouncedShowPickerSearchSkeleton = useDebouncedCallback(
    () => setMultipleRecordPickerShouldShowSkeleton(true),
    350,
  );

  useEffect(() => {
    if (previousLoadingRef.current !== multipleRecordPickerIsLoading) {
      previousLoadingRef.current = multipleRecordPickerIsLoading;

      if (multipleRecordPickerIsLoading) {
        if (!multipleRecordPickerIsFetchingMore) {
          debouncedShowPickerSearchSkeleton();
        }
      } else {
        debouncedShowPickerSearchSkeleton.cancel();
        setMultipleRecordPickerShouldShowSkeleton(false);
      }
    }
  }, [
    multipleRecordPickerIsLoading,
    setMultipleRecordPickerShouldShowSkeleton,
    multipleRecordPickerIsFetchingMore,
    debouncedShowPickerSearchSkeleton,
  ]);

  return null;
};
