import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useMutation, useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
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
        message: t`Aplikasi berhasil dihapus`,
      });
    } catch {
      enqueueErrorSnackBar({
        message: t`Terjadi kesalahan saat menghapus aplikasi`,
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
        message: t`Kepemilikan berhasil dipindahkan`,
      });
      setTransferSubdomain('');
      navigate(SettingsPath.Applications);
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal memindahkan kepemilikan. Periksa apakah subdomain sudah benar.`,
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const confirmationValue = t`yes`;

  return (
    <>
      <Section>
        <H2Title
          title={t`Zona berbahaya`}
          description={t`Hapus atau pindahkan registrasi aplikasi ini`}
        />
        <StyledDangerButtonGroup>
          <Button
            id={DELETE_REGISTRATION_BUTTON_ID}
            accent="danger"
            variant="secondary"
            title={t`Hapus aplikasi`}
            Icon={IconTrash}
            disabled={hasActiveInstalls}
            onClick={() => openModal(DELETE_REGISTRATION_MODAL_ID)}
          />
          {hasActiveInstalls && (
            <AppTooltip
              anchorSelect={`#${DELETE_REGISTRATION_BUTTON_ID}`}
              content={t`Copot pemasangan aplikasi ini dari semua ruang kerja sebelum menghapusnya`}
              noArrow
              place="bottom"
              positionStrategy="fixed"
              delay={TooltipDelay.shortDelay}
            />
          )}
          <Button
            accent="default"
            variant="secondary"
            title={t`Pindahkan kepemilikan`}
            Icon={IconShare}
            onClick={() => openModal(TRANSFER_OWNERSHIP_MODAL_ID)}
          />
        </StyledDangerButtonGroup>
      </Section>

      <ConfirmationModal
        confirmationPlaceholder={confirmationValue}
        confirmationValue={confirmationValue}
        modalInstanceId={DELETE_REGISTRATION_MODAL_ID}
        title={t`Hapus aplikasi`}
        subtitle={
          <Trans>
            Ketik {`"${confirmationValue}"`} untuk mengonfirmasi penghapusan
            aplikasi ini. Semua instalasi ruang kerja yang terhubung akan
            kehilangan kredensial OAuth-nya.
          </Trans>
        }
        onConfirmClick={handleDelete}
        confirmButtonText={t`Hapus`}
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
            title={t`Pindahkan kepemilikan`}
            fontColor={H1TitleFontColor.Primary}
          />
        </StyledAppModalTitle>
        <StyledAppModalSection
          alignment={SectionAlignment.Center}
          fontColor={SectionFontColor.Primary}
        >
          {t`Masukkan subdomain ruang kerja tujuan pemindahan aplikasi ini. Anda akan kehilangan akses untuk mengelolanya.`}
        </StyledAppModalSection>
        <Section>
          <SettingsTextInput
            instanceId="transfer-ownership-subdomain"
            value={transferSubdomain}
            onChange={setTransferSubdomain}
            placeholder={t`cth. my-workspace`}
            fullWidth
            disableHotkeys
            label={t`Subdomain ruang kerja tujuan`}
            autoFocusOnMount
          />
        </Section>
        <StyledAppModalButton
          onClick={() => {
            closeModal(TRANSFER_OWNERSHIP_MODAL_ID);
            setTransferSubdomain('');
          }}
          variant="secondary"
          title={t`Batal`}
          fullWidth
        />
        <StyledAppModalButton
          onClick={handleTransferOwnership}
          variant="secondary"
          accent="danger"
          title={t`Pindahkan`}
          disabled={
            !isNonEmptyString(transferSubdomain.trim()) || isTransferring
          }
          fullWidth
        />
      </StyledAppModal>
    </>
  );
};
