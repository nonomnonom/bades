import { styled } from '@linaria/react';
import { useMutation } from '@apollo/client/react';
import { Button } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';

import { CONFIRM_AI_WRITE_TOOL } from '@/ai/graphql/mutations/confirmAiWriteTool';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[2]};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

type PendingConfirmation = {
  toolName: string;
  arguments: Record<string, unknown>;
  operation: string;
  objectNameSingular: string;
};

type AiChatWriteConfirmationActionsProps = {
  pendingConfirmation: PendingConfirmation;
};

export const AiChatWriteConfirmationActions = ({
  pendingConfirmation,
}: AiChatWriteConfirmationActionsProps) => {
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [confirmWriteTool, { loading }] = useMutation(CONFIRM_AI_WRITE_TOOL);

  const handleConfirm = async () => {
    try {
      await confirmWriteTool({
        variables: {
          toolName: pendingConfirmation.toolName,
          arguments: pendingConfirmation.arguments,
        },
      });
      enqueueSuccessSnackBar({ message: `Operasi penulisan dikonfirmasi` });
    } catch {
      enqueueErrorSnackBar({
        message: `Gagal mengeksekusi operasi yang dikonfirmasi`,
      });
    }
  };

  return (
    <StyledContainer>
      <div>
        {`Konfirmasi diperlukan untuk operasi`} {pendingConfirmation.operation}{' '}
        {`pada`} {pendingConfirmation.objectNameSingular}.
      </div>
      <StyledActions>
        <Button
          title={`Konfirmasi`}
          variant="primary"
          accent="blue"
          disabled={loading}
          onClick={handleConfirm}
        />
      </StyledActions>
    </StyledContainer>
  );
};
