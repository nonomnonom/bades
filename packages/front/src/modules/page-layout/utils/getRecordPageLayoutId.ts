import { CoreObjectNameSingular } from 'shared/types';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { DEFAULT_NOTE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultNoteRecordPageLayoutId';
import { DEFAULT_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultRecordPageLayoutId';
import { DEFAULT_TASK_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultTaskRecordPageLayoutId';
import { DEFAULT_WORKFLOW_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowPageLayoutId';
import { DEFAULT_WORKFLOW_RUN_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowRunPageLayoutId';
import { DEFAULT_WORKFLOW_VERSION_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowVersionPageLayoutId';
import { isDefined } from 'shared/utils';

// Bades: Default page layout untuk CRM (Company/Person/Opportunity) sudah
// dihapus karena 3 object tersebut sudah tidak ada di STANDARD_OBJECTS.
// SID custom object (penduduk/keluarga/dst) memakai default layout generik
// lewat fallback DEFAULT_RECORD_PAGE_LAYOUT_ID.
const OBJECT_NAME_TO_DEFAULT_LAYOUT_ID: Record<string, string> = {
  [CoreObjectNameSingular.Note]: DEFAULT_NOTE_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Task]: DEFAULT_TASK_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Workflow]: DEFAULT_WORKFLOW_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.WorkflowVersion]:
    DEFAULT_WORKFLOW_VERSION_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.WorkflowRun]: DEFAULT_WORKFLOW_RUN_PAGE_LAYOUT_ID,
};

export const getRecordPageLayoutId = ({
  record,
  targetObjectNameSingular,
}: {
  record: ObjectRecord | null | undefined;
  targetObjectNameSingular: string;
}): string | null => {
  if (!isDefined(record)) {
    return null;
  }

  if (isDefined(record.pageLayoutId)) {
    return record.pageLayoutId;
  }

  const defaultLayoutId =
    OBJECT_NAME_TO_DEFAULT_LAYOUT_ID[targetObjectNameSingular] ??
    DEFAULT_RECORD_PAGE_LAYOUT_ID;

  return defaultLayoutId;
};
