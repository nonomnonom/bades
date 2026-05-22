import { AiChatBanner } from '@/ai/components/AiChatBanner';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { t } from '@lingui/core/macro';
import { DOCUMENTATION_PATHS } from 'shared/constants';
import { IconExternalLink } from 'ui/display';

export const AiChatApiKeyNotConfiguredMessage = () => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const handleDocsClick = () => {
    const docsUrl = getDocumentationUrl({
      locale: currentWorkspaceMember?.locale,
      path: DOCUMENTATION_PATHS.DEVELOPERS_SELF_HOST_CAPABILITIES_SETUP,
    });
    window.open(docsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AiChatBanner
      message={t`Asisten AI belum dikonfigurasi. Hubungi administrator sistem untuk mengaktifkan fitur ini.`}
      variant="warning"
      buttonTitle={t`Lihat Panduan`}
      buttonIcon={IconExternalLink}
      buttonOnClick={handleDocsClick}
    />
  );
};
