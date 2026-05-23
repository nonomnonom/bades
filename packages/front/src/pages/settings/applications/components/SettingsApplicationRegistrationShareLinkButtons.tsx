import { useLingui } from '~/utils/i18n/badesI18n';
import { Button } from 'ui/input';
import {
  IconArrowUpRight,
  IconCopy,
  IconDownload,
  IconInfoCircle,
} from 'ui/display';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'ui/theme-constants';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';
import { useInstallMarketplaceApp } from '@/marketplace/hooks/useInstallMarketplaceApp';
import { isDefined } from 'shared/utils';

const StyledButtonGroup = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

export const SettingsApplicationRegistrationShareLinkButtons = ({
  shareLink,
  isInstalled,
  universalIdentifier,
  isNpmSource = false,
  withCopyButton = false,
}: {
  shareLink: string;
  isInstalled?: boolean;
  universalIdentifier?: string;
  isNpmSource?: boolean;
  withCopyButton?: boolean;
}) => {
  const { t } = useLingui();

  const { copyToClipboard } = useCopyToClipboard();

  const { install, isInstalling } = useInstallMarketplaceApp();

  const installable =
    isDefined(isInstalled) && isDefined(universalIdentifier) && !isInstalled;

  const handleInstall = async () => {
    if (installable) {
      await install({
        universalIdentifier,
      });
    }
  };

  return (
    <StyledButtonGroup>
      {installable && (
        <Button
          Icon={IconDownload}
          title={isInstalling ? t`Memasang...` : t`Pasang`}
          variant={'secondary'}
          onClick={handleInstall}
          disabled={isInstalling}
        />
      )}
      {withCopyButton && (
        <Button
          Icon={IconCopy}
          title={t`Salin tautan berbagi`}
          variant="secondary"
          disabled={!shareLink}
          onClick={async () => {
            if (shareLink) {
              await copyToClipboard(
                `${window.location.origin}${shareLink}`,
                t`Tautan berbagi disalin ke clipboard`,
              );
            }
          }}
        />
      )}
      <Button
        Icon={isNpmSource ? IconArrowUpRight : IconInfoCircle}
        title={isNpmSource ? t`Lihat di katalog` : t`Lihat halaman aplikasi`}
        variant="secondary"
        disabled={!shareLink}
        to={shareLink}
      />
    </StyledButtonGroup>
  );
};
