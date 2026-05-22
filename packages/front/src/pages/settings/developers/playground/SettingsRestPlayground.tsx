import { Trans } from '~/utils/i18n/badesI18n';
import { RestPlayground } from '@/settings/playground/components/RestPlayground';
import { PlaygroundSchemas } from '@/settings/playground/types/PlaygroundSchemas';
import { FullScreenContainer } from '@/ui/layout/fullscreen/components/FullScreenContainer';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const SettingsRestPlayground = () => {
  const navigateSettings = useNavigateSettings();
  const { schema = PlaygroundSchemas.CORE } = useParams<{
    schema: PlaygroundSchemas;
  }>();

  const handleExitFullScreen = () => {
    navigateSettings(SettingsPath.ApiWebhooks);
  };

  const handleError = useCallback(() => {
    navigateSettings(SettingsPath.ApiWebhooks);
  }, [navigateSettings]);

  return (
    <FullScreenContainer
      exitFullScreen={handleExitFullScreen}
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: <Trans>API & Webhook</Trans>,
          href: getSettingsPath(SettingsPath.ApiWebhooks),
        },
        { children: <Trans>REST</Trans> },
      ]}
    >
      <RestPlayground schema={schema} onError={handleError} />
    </FullScreenContainer>
  );
};
