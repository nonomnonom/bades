import {
  ConfirmationModal,
  StyledCenteredButton,
} from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { OVERRIDE_WORKFLOW_DRAFT_CONFIRMATION_MODAL_ID } from '@/workflow/constants/OverrideWorkflowDraftConfirmationModalId';
import { useCreateDraftFromWorkflowVersion } from '@/workflow/hooks/useCreateDraftFromWorkflowVersion';
import { useLingui } from '@lingui/react/macro';
import { AppPath, CoreObjectNameSingular } from 'shared/types';
import { getAppPath } from 'shared/utils';
import { useNavigateApp } from '~/hooks/useNavigateApp';

export const OverrideWorkflowDraftConfirmationModal = ({
  workflowId,
  workflowVersionIdToCopy,
}: {
  workflowId: string;
  workflowVersionIdToCopy: string;
}) => {
  const { closeModal } = useModal();

  const { createDraftFromWorkflowVersion } =
    useCreateDraftFromWorkflowVersion();

  const navigate = useNavigateApp();

  const handleOverrideDraft = async () => {
    await createDraftFromWorkflowVersion({
      workflowId,
      workflowVersionIdToCopy,
    });

    navigate(AppPath.RecordShowPage, {
      objectNameSingular: CoreObjectNameSingular.Workflow,
      objectRecordId: workflowId,
    });
  };

  const { t } = useLingui();

  return (
    <>
      <ConfirmationModal
        modalInstanceId={OVERRIDE_WORKFLOW_DRAFT_CONFIRMATION_MODAL_ID}
        title={"Draf sudah ada"}
        subtitle={"Draf sudah ada untuk alur kerja ini. Apakah Anda yakin ingin menghapusnya?"}
        onConfirmClick={handleOverrideDraft}
        confirmButtonText={""Override Draft"}
        AdditionalButtons={
          <StyledCenteredButton
            to={getAppPath(AppPath.RecordShowPage, {
              objectNameSingular: CoreObjectNameSingular.Workflow,
              objectRecordId: workflowId,
            })}
            onClick={() => {
              closeModal(OVERRIDE_WORKFLOW_DRAFT_CONFIRMATION_MODAL_ID);
            }}
            variant="secondary"
            title={""Go to Draft"}
            fullWidth
            justify="center"
          />
        }
      />
    </>
  );
};
