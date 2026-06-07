import { useAuth } from '@/auth/hooks/useAuth';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { AppPath } from 'shared/types';
import { useNavigateApp } from '~/hooks/useNavigateApp';
import { isGraphqlErrorOfType } from '~/utils/is-graphql-error-of-type.util';

export const useVerifyLogin = () => {
  const { enqueueErrorSnackBar } = useSnackBar();
  const navigate = useNavigateApp();
  const { getAuthTokensFromLoginToken } = useAuth();
  const verifyLoginToken = async (loginToken: string) => {
    try {
      await getAuthTokensFromLoginToken(loginToken);
    } catch (error) {
      if (isGraphqlErrorOfType(error, 'EMAIL_NOT_VERIFIED')) {
        enqueueErrorSnackBar({
          message: `Email belum diverifikasi. Silakan periksa kotak masuk Anda.`,
        });
        navigate(AppPath.SignInUp);
      } else {
        enqueueErrorSnackBar({
          message: `Autentikasi gagal`,
        });
        navigate(AppPath.SignInUp);
      }
    }
  };

  return { verifyLoginToken };
};
