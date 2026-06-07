import { type ErrorLike } from '@apollo/client';
import { AppPath } from 'shared/types';
import { getAppPath, isDefined } from 'shared/utils';
import { getConflictingRecordFromApolloError } from '~/utils/get-conflicting-record-from-apollo-error.util';
import { type SnackBarOptions } from '@/ui/feedback/snack-bar-manager/states/snackBarInternalComponentState';

export const buildErrorAction = (
  apolloError?: ErrorLike,
): Pick<SnackBarOptions, 'buttonLabel' | 'buttonTo'> | null => {
  if (!apolloError) {
    return null;
  }

  const conflictingRecord = getConflictingRecordFromApolloError(apolloError);

  if (isDefined(conflictingRecord)) {
    return {
      buttonLabel: `Lihat data yang sudah ada`,
      buttonTo: getAppPath(AppPath.RecordShowPage, {
        objectNameSingular: conflictingRecord.conflictingObjectNameSingular,
        objectRecordId: conflictingRecord.conflictingRecordId,
      }),
    };
  }

  return null;
};
