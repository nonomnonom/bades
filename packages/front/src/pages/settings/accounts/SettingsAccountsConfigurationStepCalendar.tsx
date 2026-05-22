
import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { type CalendarChannel } from '@/accounts/types/CalendarChannel';
import { type MessageChannel } from '@/accounts/types/MessageChannel';
import { SettingsAccountsCalendarChannelDetails } from '@/settings/accounts/components/SettingsAccountsCalendarChannelDetails';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { IconDeviceFloppy } from 'ui/display';
import { Button } from 'ui/input';

type SettingsAccountsConfigurationStepCalendarProps = {
  calendarChannel: CalendarChannel;
  messageChannel?: MessageChannel;
  isSubmitting: boolean;
  onAddAccount: () => void;
};

export const SettingsAccountsConfigurationStepCalendar = ({
  calendarChannel,
  messageChannel,
  isSubmitting,
  onAddAccount,
}: SettingsAccountsConfigurationStepCalendarProps) => {
  const { t } = useLingui();

  const stepNumber = isDefined(messageChannel) ? 2 : 1;
  const stepTitle = t`${stepNumber}. Kalender`;

  return (
    <SubMenuTopBarContainer
      title={stepTitle}
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
          children: stepTitle,
        },
      ]}
      actionButton={
        <Button
          Icon={IconDeviceFloppy}
          title={t`Selesaikan Penyiapan`}
          accent="blue"
          size="small"
          variant="primary"
          onClick={onAddAccount}
          disabled={isSubmitting}
        />
      }
    >
      <SettingsPageContainer>
        <SettingsAccountsCalendarChannelDetails
          calendarChannel={calendarChannel}
        />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
