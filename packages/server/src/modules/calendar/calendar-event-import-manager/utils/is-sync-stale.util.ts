import { isDefined } from 'shared/utils';

import { CALENDAR_IMPORT_ONGOING_SYNC_TIMEOUT } from 'src/modules/calendar/calendar-event-import-manager/constants/calendar-import-ongoing-sync-timeout.constant';

export const isSyncStale = (syncStageStartedAt?: string | null): boolean => {
  if (!isDefined(syncStageStartedAt)) {
    return true;
  }

  const syncStageStartedTime = new Date(syncStageStartedAt).getTime();

  if (isNaN(syncStageStartedTime)) {
    throw new Error('Format tanggal tidak valid');
  }

  return (
    Date.now() - syncStageStartedTime > CALENDAR_IMPORT_ONGOING_SYNC_TIMEOUT
  );
};
