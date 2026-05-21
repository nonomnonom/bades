import { useAuth } from '@/auth/hooks/useAuth';
import { availableWorkspacesState } from '@/auth/states/availableWorkspacesState';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { countAvailableWorkspaces } from '@/auth/utils/availableWorkspacesUtils';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Button } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';
import { useMutation } from '@apollo/client/react';
import {
  DeleteUserAccountDocument,
  DeleteUserWorkspaceDocument,
} from '~/generated-metadata/graphql';

const DELETE_ACCOUNT_MODAL_ID = 'delete-account-modal';
const LEAVE_WORKSPACE_MODAL_ID = 'leave-workspace-modal';

const StyledDiv = styled.div`
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

export const DeleteAccount = () => {
  const { t } = useLingui();
  const { openModal } = useModal();
  const { enqueueErrorSnackBar } = useSnackBar();

  const [deleteUserAccount] = useMutation(DeleteUserAccountDocument);
  const [deleteUserFromWorkspace] = useMutation(DeleteUserWorkspaceDocument);
  const currentUser = useAtomStateValue(currentUserState);
  const userEmail = currentUser?.email;
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const currentWorkspaceMemberId = currentWorkspaceMember?.id;
  const { signOut } = useAuth();
  const availableWorkspaces = useAtomStateValue(availableWorkspacesState);
  const availableWorkspacesCount =
    countAvailableWorkspaces(availableWorkspaces);

  const userHasMultipleWorkspaces = availableWorkspacesCount > 1;

  const deleteAccount = async () => {
    await deleteUserAccount();
    await signOut();
  };

  const leaveWorkspace = async () => {
    if (!isDefined(currentWorkspaceMemberId)) {
      enqueueErrorSnackBar({
        message: ""Current workspace member not found.",
      });
      return;
    }

    await deleteUserFromWorkspace?.({
      variables: {
        workspaceMemberIdToDelete: currentWorkspaceMemberId,
      },
    });
    await signOut();
  };

  return (
    <>
      <H2Title
        title={""Danger zone"}
        description={
          userHasMultipleWorkspaces
            ? ""Delete account and all the associated data or leave workspace"
            : ""Delete account and all the associated data"
        }
      />
      {userHasMultipleWorkspaces && (
        <StyledDiv>
          <Button
            accent="danger"
            onClick={() => openModal(LEAVE_WORKSPACE_MODAL_ID)}
            variant="secondary"
            title={"Keluar dari ruang kerja"}
          />

          <ConfirmationModal
            confirmationValue={userEmail}
            confirmationPlaceholder={userEmail ?? ''}
            modalInstanceId={LEAVE_WORKSPACE_MODAL_ID}
            title={"Keluar dari ruang kerja"}
            subtitle={
              <>
                {""This action cannot be undone. This will permanently remove your membership from this workspace."}
                <br />
                {""Please type in your email to confirm."}
              </>
            }
            onConfirmClick={leaveWorkspace}
            confirmButtonText={"Keluar dari ruang kerja"}
          />
        </StyledDiv>
      )}
      <Button
        accent="danger"
        onClick={() => openModal(DELETE_ACCOUNT_MODAL_ID)}
        variant="secondary"
        title={"Hapus akun"}
      />
      <ConfirmationModal
        confirmationValue={userEmail}
        confirmationPlaceholder={userEmail ?? ''}
        modalInstanceId={DELETE_ACCOUNT_MODAL_ID}
        title={"Penghapusan Akun"}
        subtitle={
          <>
            {t`This action cannot be undone. This will permanently delete your
            entire account.`}
            <br />
            {""Please type in your email to confirm."}
          </>
        }
        onConfirmClick={deleteAccount}
        confirmButtonText={"Hapus akun"}
      />
    </>
  );
};
