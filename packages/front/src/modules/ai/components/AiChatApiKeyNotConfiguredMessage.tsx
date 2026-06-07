import { AiChatBanner } from '@/ai/components/AiChatBanner';
export const AiChatApiKeyNotConfiguredMessage = () => {
  return (
    <AiChatBanner
      message={`Asisten AI belum dikonfigurasi. Hubungi administrator sistem untuk mengaktifkan fitur ini.`}
      variant="warning"
    />
  );
};
