import { useLingui } from '@lingui/react/macro';
import { CommandBlock, H2Title, IconCopy } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { ApplicationRegistrationSourceType } from '~/generated-metadata/graphql';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';
import { type ApplicationRegistrationData } from '~/pages/settings/applications/tabs/types/ApplicationRegistrationData';
import { SettingsApplicationRegistrationShareLinkButtons } from '~/pages/settings/applications/components/SettingsApplicationRegistrationShareLinkButtons';

export const SettingsApplicationRegistrationDistributionTab = ({
  registration,
}: {
  registration: ApplicationRegistrationData;
}) => {
  const { t } = useLingui();

  const { copyToClipboard } = useCopyToClipboard();

  const isNpmSource =
    registration.sourceType === ApplicationRegistrationSourceType.NPM;

  const isTarballSource =
    registration.sourceType === ApplicationRegistrationSourceType.TARBALL;

  const shareLink = getSettingsPath(SettingsPath.AvailableApplicationDetail, {
    availableApplicationId: registration.universalIdentifier,
  });

  const publishCommands = ['yarn bades app:publish'];

  return (
    <>
      <Section>
        <H2Title
          title={t`Publik`}
          description={t`Rilis aplikasi ke katalog internal Bades agar dapat dipasang di ruang kerja lain`}
        />
        {isNpmSource && (
          <SettingsApplicationRegistrationShareLinkButtons
            shareLink={shareLink}
            isNpmSource
            withCopyButton
          />
        )}
        {isTarballSource && (
          <CommandBlock
            commands={publishCommands}
            button={
              <Button
                onClick={() => {
                  copyToClipboard(
                    publishCommands.join('\n'),
                    t`Perintah disalin ke clipboard`,
                  );
                }}
                ariaLabel={t`Salin perintah`}
                Icon={IconCopy}
              />
            }
          />
        )}
      </Section>
      {isTarballSource && (
        <Section>
          <H2Title
            title={t`Privat`}
            description={t`Bagikan aplikasi ke ruang kerja lain tanpa merilis ke katalog`}
          />
          <SettingsApplicationRegistrationShareLinkButtons
            shareLink={shareLink}
            withCopyButton
          />
        </Section>
      )}
    </>
  );
};
