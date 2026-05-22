import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { CombinedGraphQLErrors } from '@apollo/client/errors';

import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';

import { SettingsPath } from 'shared/types';
import { useMutation } from '@apollo/client/react';
import { DeleteOneAgentDocument } from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

const DELETE_AGENT_MODAL_ID = 'delete-agent-modal';

type SettingsAgentDeleteConfirmationModalProps = {
  agentId: string;
  agentName: string;
};

export const SettingsAgentDeleteConfirmationModal = ({
  agentId,
  agentName,
}: SettingsAgentDeleteConfirmationModalProps) => {
  const { t } = useLingui();
  const { closeModal } = useModal();
  const navigate = useNavigateSettings();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [deleteAgent] = useMutation(DeleteOneAgentDocument);

  const handleDelete = async () => {
    try {
      await deleteAgent({
        variables: {
          input: { id: agentId },
        },
      });
      closeModal(DELETE_AGENT_MODAL_ID);
      navigate(SettingsPath.AI);
    } catch (error) {
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  };

  return (
    <ConfirmationModal
      confirmationValue={agentName}
      confirmationPlaceholder={agentName}
      modalInstanceId={DELETE_AGENT_MODAL_ID}
      title={t`Hapus Agen`}
      subtitle={
        <Trans>
          Tindakan ini tidak dapat dibatalkan. Agen Anda akan dihapus secara permanen.
          <br />
          Ketik nama agen untuk mengkonfirmasi.
        </Trans>
      }
      onConfirmClick={handleDelete}
      confirmButtonText={t`Hapus Agen`}
    />
  );
};
