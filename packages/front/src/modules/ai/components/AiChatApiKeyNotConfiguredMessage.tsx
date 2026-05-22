import { AiChatBanner } from '@/ai/components/AiChatBanner';
import { t } from '@lingui/core/macro';

export const AiChatApiKeyNotConfiguredMessage = () => {
  return (
    <AiChatBanner
      message={t`Asisten AI belum dikonfigurasi. Hubungi administrator sistem untuk mengaktifkan fitur ini.`}
      variant="warning"
    />
  );
};
