import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useMutation, useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { Trans, useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useState } from 'react';
import { SettingsPath } from 'shared/types';
import {
  AppTooltip,
  H1Title,
  H1TitleFontColor,
  H2Title,
  IconShare,
  IconTrash,
  TooltipDelay,
} from 'ui/display';
import { Button } from 'ui/input';
import { Section, SectionAlignment, SectionFontColor } from 'ui/layout';
import {
  type ApplicationRegistration,
  DeleteApplicationRegistrationDocument,
  FindApplicationRegistrationStatsDocument,
  FindManyApplicationRegistrationsDocument,
  TransferApplicationRegistrationOwnershipDocument,
} from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { themeCssVariables } from 'ui/theme-constants';
import {
  StyledAppModal,
  StyledAppModalButton,
  StyledAppModalSection,
  StyledAppModalTitle,
} from '~/pages/settings/applications/components/SettingsAppModalLayout';
import { isDefined } from 'shared/utils';

const DELETE_REGISTRATION_MODAL_ID = 'delete-application-registration-modal';

const TRANSFER_OWNERSHIP_MODAL_ID =
  'transfer-application-registration-ownership-modal';

const DELETE_REGISTRATION_BUTTON_ID = 'delete-registration-button';

const StyledDangerButtonGroup = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

export const SettingsAdminApplicationRegistrationDangerZone = ({
  registration,
  fromAdmin = false,
}: {
  registration: ApplicationRegistration;
  fromAdmin?: boolean;
}) => {
  const { t } = useLingui();
  const navigate = useNavigateSettings();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { openModal, closeModal } = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSubdomain, setTransferSubdomain] = useState('');

  const applicationRegistrationId = registration.id;

  const { data: statsData } = useQuery(
    FindApplicationRegistrationStatsDocument,
    {
      variables: { id: applicationRegistrationId },
      skip: !applicationRegistrationId,
    },
  );

  const stats = statsData?.findApplicationRegistrationStats;

  const hasActiveInstalls =
    !isDefined(stats) || (stats.activeInstalls ?? 0) > 0;

  const [deleteRegistration] = useMutation(
    DeleteApplicationRegistrationDocument,
    {
      refetchQueries: [FindManyApplicationRegistrationsDocument],
    },
  );

  const [transferOwnership] = useMutation(
    TransferApplicationRegistrationOwnershipDocument,
    {
      refetchQueries: [FindManyApplicationRegistrationsDocument],
    },
  );

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteRegistration({
        variables: { id: applicationRegistrationId },
      });

      if (fromAdmin) {
        navigate(
          SettingsPath.AdminPanel,
          undefined,
          undefined,
          undefined,
          '#app',
        );
      } else {
        navigate(
          SettingsPath.Applications,
          undefined,
          undefined,
          undefined,
          '#developer',
        );
      }

      enqueueSuccessSnackBar({
        message: ""App deleted successfully",
      });
    } catch {
      enqueueErrorSnackBar({
        message: ""Error deleting app",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferOwnership = async () => {
    const trimmed = transferSubdomain.trim();

    if (!isNonEmptyString(trimmed)) {
      return;
    }

    setIsTransferring(true);
    try {
      await transferOwnership({
        variables: {
          applicationRegistrationId,
          targetWorkspaceSubdomain: trimmed,
        },
      });
      enqueueSuccessSnackBar({
        message: ""Ownership transferred successfully",
      });
      setTransferSubdomain('');
      navigate(SettingsPath.Applications);
    } catch {
      enqueueErrorSnackBar({
        message: ""Failed to transfer ownership. Check that the subdomain is correct.",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const confirmationValue = ""yes";

  return (
    <>
      <Section>
        <H2Title
          title={""Danger zone"}
          description={""Delete or transfer this app registration"}
        />
        <StyledDangerButtonGroup>
          <Button
            id={DELETE_REGISTRATION_BUTTON_ID}
            accent="danger"
            variant="secondary"
            title={""Delete app"}
            Icon={IconTrash}
            disabled={hasActiveInstalls}
            onClick={() => openModal(DELETE_REGISTRATION_MODAL_ID)}
          />
          {hasActiveInstalls && (
            <AppTooltip
              anchorSelect={`#${DELETE_REGISTRATION_BUTTON_ID}`}
              content={""Uninstall this app from all workspaces before deleting it"}
              noArrow
              place="bottom"
              positionStrategy="fixed"
              delay={TooltipDelay.shortDelay}
            />
          )}
          <Button
            accent="default"
            variant="secondary"
            title={""Transfer ownership"}
            Icon={IconShare}
            onClick={() => openModal(TRANSFER_OWNERSHIP_MODAL_ID)}
          />
        </StyledDangerButtonGroup>
      </Section>

      <ConfirmationModal
        confirmationPlaceholder={confirmationValue}
        confirmationValue={confirmationValue}
        modalInstanceId={DELETE_REGISTRATION_MODAL_ID}
        title={""Delete app"}
        subtitle={
          <Trans>
            Please type {`"${confirmationValue}"`} to confirm you want to delete
            this app. All workspace installations linked to it will lose their
            OAuth credentials.
          </Trans>
        }
        onConfirmClick={handleDelete}
        confirmButtonText={"Hapus"}
        loading={isLoading}
      />

      <StyledAppModal
        modalId={TRANSFER_OWNERSHIP_MODAL_ID}
        isClosable
        onClose={() => setTransferSubdomain('')}
        padding="large"
        dataGloballyPreventClickOutside
      >
        <StyledAppModalTitle>
          <H1Title
            title={""Transfer ownership"}
            fontColor={H1TitleFontColor.Primary}
          />
        </StyledAppModalTitle>
        <StyledAppModalSection
          alignment={SectionAlignment.Center}
          fontColor={SectionFontColor.Primary}
        >
          {""Enter the workspace subdomain to transfer this app to. You will lose access to manage it."}
        </StyledAppModalSection>
        <Section>
          <SettingsTextInput
            instanceId="transfer-ownership-subdomain"
            value={transferSubdomain}
            onChange={setTransferSubdomain}
            placeholder={""e.g. my-workspace"}
            fullWidth
            disableHotkeys
            label={""Target workspace subdomain"}
            autoFocusOnMount
          />
        </Section>
        <StyledAppModalButton
          onClick={() => {
            closeModal(TRANSFER_OWNERSHIP_MODAL_ID);
            setTransferSubdomain('');
          }}
          variant="secondary"
          title={"Batalkan"}
          fullWidth
        />
        <StyledAppModalButton
          onClick={handleTransferOwnership}
          variant="secondary"
          accent="danger"
          title={""Transfer"}
          disabled={
            !isNonEmptyString(transferSubdomain.trim()) || isTransferring
          }
          fullWidth
        />
      </StyledAppModal>
    </>
  );
};
