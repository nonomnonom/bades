import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { SettingsTableCard } from '@/settings/components/SettingsTableCard';
import { ApiKeyInput } from '@/settings/applications/components/ApiKeyInput';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { useMutation } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { isNonEmptyString } from '@sniptt/guards';
import { useState } from 'react';
import { H2Title, IconKey, IconRefresh, IconShield } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import {
  RotateApplicationRegistrationClientSecretDocument,
  UpdateApplicationRegistrationDocument,
} from '~/generated-metadata/graphql';
import { applicationRegistrationClientSecretFamilyState } from '~/pages/settings/applications/states/applicationRegistrationClientSecretFamilyState';
import { type ApplicationRegistrationData } from '~/pages/settings/applications/tabs/types/ApplicationRegistrationData';
import { SettingsApplicationRegistrationRedirectURIsInput } from '~/pages/settings/applications/components/SettingsApplicationRegistrationRedirectURIsInput';
import { SettingsApplicationRegistrationRedirectURIsTable } from '~/pages/settings/applications/components/SettingsApplicationRegistrationRedirectURIsTable';

const ROTATE_SECRET_MODAL_ID = 'rotate-application-registration-secret-modal';

const StyledRotateContainer = styled.div`
  padding-top: ${themeCssVariables.spacing[2]};
`;

export const SettingsApplicationRegistrationOAuthTab = ({
  registration,
}: {
  registration: ApplicationRegistrationData;
}) => {
  const { t } = useLingui();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { openModal } = useModal();

  const applicationRegistrationId = registration.id;

  const applicationRegistrationClientSecret = useAtomFamilyStateValue(
    applicationRegistrationClientSecretFamilyState,
    applicationRegistrationId,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [rotatedSecret, setRotatedSecret] = useState<string | null>(null);
  const [formRedirectUris, setFormRedirectUris] = useState<string[]>(
    registration.oAuthRedirectUris ?? [],
  );

  const [updateRegistration] = useMutation(
    UpdateApplicationRegistrationDocument,
  );

  const [rotateSecret] = useMutation(
    RotateApplicationRegistrationClientSecretDocument,
  );

  const handleSave = async (newFormRedirectUris: string[]) => {
    setIsLoading(true);

    try {
      await updateRegistration({
        variables: {
          input: {
            id: applicationRegistrationId,
            update: {
              oAuthRedirectUris: newFormRedirectUris,
            },
          },
        },
      });
      enqueueSuccessSnackBar({ message: t`Redirect URI berhasil diperbarui` });
      setFormRedirectUris(newFormRedirectUris);
    } catch {
      enqueueErrorSnackBar({ message: t`Gagal memperbarui Redirect URI` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRotateSecret = async () => {
    setIsLoading(true);
    try {
      const result = await rotateSecret({
        variables: { id: applicationRegistrationId },
      });
      const secret =
        result.data?.rotateApplicationRegistrationClientSecret?.clientSecret;

      if (isNonEmptyString(secret)) {
        setRotatedSecret(secret);
        enqueueSuccessSnackBar({
          message: t`Client secret dirotasi. Salin sekarang — tidak akan ditampilkan lagi.`,
        });
      }
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal merotasi client secret`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const displayedSecret = rotatedSecret ?? applicationRegistrationClientSecret;

  const confirmationValue = t`yes`;

  const credentialItems = [
    {
      Icon: IconKey,
      label: t`ID Klien`,
      value: registration.oAuthClientId,
    },
    {
      Icon: IconShield,
      label: t`Cakupan`,
      value: (registration.oAuthScopes ?? []).join(', ') || '—',
    },
  ];

  return (
    <>
      <Section>
        <H2Title
          title={t`OAuth`}
          description={t`Kredensial dan cakupan untuk alur otorisasi OAuth`}
        />
        <SettingsTableCard
          rounded
          items={credentialItems}
          gridAutoColumns="3fr 8fr"
        />
        <StyledRotateContainer>
          <Button
            Icon={IconRefresh}
            title={t`Rotasi client secret`}
            variant="secondary"
            onClick={() => openModal(ROTATE_SECRET_MODAL_ID)}
          />
        </StyledRotateContainer>
      </Section>

      {displayedSecret && (
        <Section>
          <H2Title
            title={t`Client Secret`}
            description={t`Salin secret ini sekarang karena tidak akan ditampilkan lagi`}
          />
          <ApiKeyInput apiKey={displayedSecret} />
        </Section>
      )}

      <Section>
        <H2Title
          title={t`Redirect URI`}
          description={t`Redirect URI yang diizinkan untuk alur OAuth`}
        />
        <SettingsApplicationRegistrationRedirectURIsInput
          redirectUris={formRedirectUris}
          updateRedirectUris={handleSave}
        />
        <SettingsApplicationRegistrationRedirectURIsTable
          redirectUris={formRedirectUris}
          updateRedirectUris={handleSave}
        />
      </Section>

      <ConfirmationModal
        confirmationPlaceholder={confirmationValue}
        confirmationValue={confirmationValue}
        modalInstanceId={ROTATE_SECRET_MODAL_ID}
        title={t`Rotasi client secret`}
        subtitle={
          <Trans>
            Jika Anda merotasi secret ini, semua integrasi yang menggunakan
            secret saat ini akan berhenti bekerja. Ketik{' '}
            {`"${confirmationValue}"`} untuk mengonfirmasi.
          </Trans>
        }
        onConfirmClick={handleRotateSecret}
        confirmButtonText={t`Rotasi secret`}
        loading={isLoading}
      />
    </>
  );
};
