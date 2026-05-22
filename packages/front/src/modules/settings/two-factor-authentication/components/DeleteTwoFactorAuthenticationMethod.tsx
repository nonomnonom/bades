import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useLoadCurrentUser } from '@/users/hooks/useLoadCurrentUser';
import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { useParams } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { isDefined } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Button } from 'ui/input';
import { useMutation } from '@apollo/client/react';
import { DeleteTwoFactorAuthenticationMethodDocument } from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { useCurrentUserWorkspaceTwoFactorAuthentication } from '@/settings/two-factor-authentication/hooks/useCurrentUserWorkspaceTwoFactorAuthentication';
import { useCurrentWorkspaceTwoFactorAuthenticationPolicy } from '@/settings/two-factor-authentication/hooks/useWorkspaceTwoFactorAuthenticationPolicy';

const DELETE_TWO_FACTOR_AUTHENTICATION_MODAL_ID =
  'delete-two-factor-authentication-modal';
export const DeleteTwoFactorAuthentication = () => {
  const { t } = useLingui();
  const { openModal } = useModal();

  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();
  const { signOut } = useAuth();
  const { loadCurrentUser } = useLoadCurrentUser();
  const [deleteTwoFactorAuthenticationMethod] = useMutation(
    DeleteTwoFactorAuthenticationMethodDocument,
  );
  const currentUser = useAtomStateValue(currentUserState);
  const userEmail = currentUser?.email;
  const navigate = useNavigateSettings();
  const twoFactorAuthenticationStrategy =
    useParams().twoFactorAuthenticationStrategy;

  const { currentUserWorkspaceTwoFactorAuthenticationMethods } =
    useCurrentUserWorkspaceTwoFactorAuthentication();

  const { isEnforced: isTwoFactorAuthenticationEnforced } =
    useCurrentWorkspaceTwoFactorAuthenticationPolicy();

  const reset2FA = async () => {
    if (
      !isDefined(twoFactorAuthenticationStrategy) ||
      !isDefined(
        currentUserWorkspaceTwoFactorAuthenticationMethods[
          twoFactorAuthenticationStrategy
        ]?.twoFactorAuthenticationMethodId,
      )
    ) {
      enqueueErrorSnackBar({
        message: t`Informasi 2FA tidak valid.`,
        options: {
          dedupeKey: '2fa-dedupe-key',
        },
      });
      return navigate(SettingsPath.ProfilePage);
    }

    await deleteTwoFactorAuthenticationMethod({
      variables: {
        twoFactorAuthenticationMethodId:
          currentUserWorkspaceTwoFactorAuthenticationMethods[
            twoFactorAuthenticationStrategy
          ].twoFactorAuthenticationMethodId,
      },
    });

    enqueueSuccessSnackBar({
      message: t`Metode 2FA berhasil dihapus.`,
      options: {
        dedupeKey: '2fa-dedupe-key',
      },
    });

    if (isTwoFactorAuthenticationEnforced === true) {
      await signOut();
    } else {
      navigate(SettingsPath.ProfilePage);
      await loadCurrentUser();
    }
  };

  return (
    <>
      <H2Title
        title={t`Hapus Metode Autentikasi Dua Faktor`}
        description={t`Menghapus metode ini akan menghapusnya secara permanen dari akun Anda.`}
      />

      <Button
        accent="danger"
        onClick={() => openModal(DELETE_TWO_FACTOR_AUTHENTICATION_MODAL_ID)}
        variant="secondary"
        title={t`Setel ulang 2FA`}
      />

      <ConfirmationModal
        confirmationValue={userEmail}
        confirmationPlaceholder={userEmail ?? ''}
        modalInstanceId={DELETE_TWO_FACTOR_AUTHENTICATION_MODAL_ID}
        title={t`Setel Ulang Metode 2FA`}
        subtitle={
          isTwoFactorAuthenticationEnforced ? (
            <Trans>
              Ini akan menghapus metode autentikasi dua faktor Anda secara
              permanen.
              <br />
              Karena 2FA diwajibkan di ruang kerja Anda, Anda akan keluar
              setelah penghapusan dan diminta untuk mengonfigurasinya kembali
              saat masuk.{' '}
              <br />
              Ketik email Anda untuk mengonfirmasi.
            </Trans>
          ) : (
            <Trans>
              Tindakan ini tidak dapat dibatalkan. Ini akan menyetel ulang
              metode autentikasi dua faktor Anda secara permanen. <br /> Ketik
              email Anda untuk mengonfirmasi.
            </Trans>
          )
        }
        onConfirmClick={reset2FA}
        confirmButtonText={t`Setel ulang 2FA`}
      />
    </>
  );
};
