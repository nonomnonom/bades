import { singleRecordPickerShouldShowSkeletonComponentState } from '@/object-record/record-picker/single-record-picker/states/singleRecordPickerShouldShowSkeletonComponentState';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const SingleRecordPickerLoadingEffect = ({
  loading,
}: {
  loading: boolean;
}) => {
  const previousLoadingRef = useRef(false);

  const setSingleRecordPickerShouldShowSkeleton = useSetAtomComponentState(
    singleRecordPickerShouldShowSkeletonComponentState,
  );

  const debouncedShowPickerSearchSkeleton = useDebouncedCallback(() => {
    setSingleRecordPickerShouldShowSkeleton(true);
  }, 350);

  useEffect(() => {
    if (previousLoadingRef.current !== loading) {
      previousLoadingRef.current = loading;

      if (loading) {
        debouncedShowPickerSearchSkeleton();
      } else {
        debouncedShowPickerSearchSkeleton.cancel();
        setSingleRecordPickerShouldShowSkeleton(false);
      }
    }
  }, [
    loading,
    debouncedShowPickerSearchSkeleton,
    setSingleRecordPickerShouldShowSkeleton,
  ]);

  return null;
};
