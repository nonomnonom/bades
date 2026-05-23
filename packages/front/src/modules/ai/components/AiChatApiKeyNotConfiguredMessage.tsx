import { AiChatBanner } from '@/ai/components/AiChatBanner';
import { t } from '~/utils/i18n/badesI18n';

export const AiChatApiKeyNotConfiguredMessage = () => {
  return (
    <AiChatBanner
      message={t`Asisten AI belum dikonfigurasi. Hubungi administrator sistem untuk mengaktifkan fitur ini.`}
      variant="warning"
    />
  );
};
