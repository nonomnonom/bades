import { Trans, useLingui } from '@lingui/react/macro';

import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useRedirectToDefaultDomain } from '@/domain-manager/hooks/useRedirectToDefaultDomain';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { H2Title, IconTrash } from 'ui/display';
import { Button } from 'ui/input';
import { useMutation } from '@apollo/client/react';
import { DeleteCurrentWorkspaceDocument } from '~/generated-metadata/graphql';

const DELETE_WORKSPACE_MODAL_ID = 'delete-workspace-modal';

export const DeleteWorkspace = () => {
  const [deleteCurrentWorkspace] = useMutation(DeleteCurrentWorkspaceDocument);
  const currentUser = useAtomStateValue(currentUserState);
  const userEmail = currentUser?.email;
  const { t } = useLingui();
  const { openModal } = useModal();

  const { signOut } = useAuth();
  const { redirectToDefaultDomain } = useRedirectToDefaultDomain();

  const deleteWorkspace = async () => {
    await deleteCurrentWorkspace();
    await signOut();
    redirectToDefaultDomain();
  };

  return (
    <>
      <H2Title
        title={t`Danger zone`}
        description={t`Hapus seluruh ruang kerja Anda`}
      />
      <Button
        accent="danger"
        variant="secondary"
        title={t`Hapus ruang kerja`}
        Icon={IconTrash}
        onClick={() => openModal(DELETE_WORKSPACE_MODAL_ID)}
      />

      <ConfirmationModal
        modalInstanceId={DELETE_WORKSPACE_MODAL_ID}
        confirmationPlaceholder={userEmail}
        confirmationValue={userEmail}
        title={t`Hapus Ruang Kerja`}
        subtitle={
          <Trans>
            Tindakan ini tidak dapat dibatalkan. Seluruh ruang kerja dan
            datanya akan dihapus secara permanen. <br /> Ketik email Anda untuk
            mengonfirmasi.
          </Trans>
        }
        onConfirmClick={deleteWorkspace}
        confirmButtonText={t`Hapus ruang kerja`}
      />
    </>
  );
};
