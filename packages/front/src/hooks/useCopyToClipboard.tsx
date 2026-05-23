import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useLingui } from '~/utils/i18n/badesI18n';
import { IconCopy, IconExclamationCircle } from 'ui/display';
import { useContext } from 'react';
import { ThemeContext } from 'ui/theme-constants';
export const useCopyToClipboard = () => {
  const { theme } = useContext(ThemeContext);
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { t } = useLingui();

  const copyToClipboard = async (valueAsString: string, message?: string) => {
    if (!window.isSecureContext) {
      enqueueErrorSnackBar({
        message: t`Salin papan klip butuh koneksi aman (HTTPS). Buka aplikasi ini melalui HTTPS agar bisa menyalin.`,
        options: {
          icon: <IconExclamationCircle size={16} color="red" />,
          duration: 6000,
        },
      });

      return;
    }

    try {
      await navigator.clipboard.writeText(valueAsString);

      enqueueSuccessSnackBar({
        message: message || t`Tersalin ke papan klip`,
        options: {
          icon: <IconCopy size={theme.icon.size.md} />,
          duration: 2000,
        },
      });
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal menyalin ke papan klip`,
        options: {
          icon: <IconExclamationCircle size={16} color="red" />,
          duration: 2000,
        },
      });
    }
  };

  return { copyToClipboard };
};
