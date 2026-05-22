import { Trans, useLingui } from '@lingui/react/macro';

import { type MessageChannel } from '@/accounts/types/MessageChannel';
import { SettingsAccountsMessageChannelDetails } from '@/settings/accounts/components/SettingsAccountsMessageChannelDetails';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { IconChevronRight, IconPlus } from 'ui/display';
import { Button } from 'ui/input';

type SettingsAccountsConfigurationStepEmailProps = {
  messageChannel: MessageChannel;
  hasNextStep: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onAddAccount: () => void;
};

export const SettingsAccountsConfigurationStepEmail = ({
  messageChannel,
  hasNextStep,
  isSubmitting,
  onNext,
  onAddAccount,
}: SettingsAccountsConfigurationStepEmailProps) => {
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={t`1. Surel`}
      links={[
        {
          children: <Trans>Pengguna</Trans>,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        {
          children: <Trans>Akun</Trans>,
          href: getSettingsPath(SettingsPath.Accounts),
        },
        {
          children: t`1. Surel`,
        },
      ]}
      actionButton={
        hasNextStep ? (
          <Button
            Icon={IconChevronRight}
            title={t`Lanjut`}
            accent="blue"
            size="small"
            variant="secondary"
            onClick={onNext}
            disabled={isSubmitting}
          />
        ) : (
          <Button
            Icon={IconPlus}
            title={t`Tambah akun`}
            accent="blue"
            size="small"
            variant="primary"
            onClick={onAddAccount}
            disabled={isSubmitting}
          />
        )
      }
    >
      <SettingsPageContainer>
        <SettingsAccountsMessageChannelDetails
          messageChannel={messageChannel}
        />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
