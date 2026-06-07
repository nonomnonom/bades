import { useHandleResetPassword } from '@/auth/sign-in-up/hooks/useHandleResetPassword';
import { currentUserState } from '@/auth/states/currentUserState';
import { H2Title } from 'ui/display';
import { Button } from 'ui/input';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const SetOrChangePassword = () => {
  const currentUser = useAtomStateValue(currentUserState);

  const { handleResetPassword } = useHandleResetPassword();

  const hasPassword = currentUser?.hasPassword ?? false;
  const heading = hasPassword ? `Ubah Kata Sandi` : `Atur Kata Sandi`;
  const description = hasPassword
    ? `Terima email berisi tautan untuk memperbarui kata sandi`
    : `Terima email berisi tautan untuk mengatur kata sandi`;

  return (
    <>
      <H2Title title={heading} description={description} />
      <Button
        onClick={handleResetPassword()}
        variant="secondary"
        title={heading}
      />
    </>
  );
};
