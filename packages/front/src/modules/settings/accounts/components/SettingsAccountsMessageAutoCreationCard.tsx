import { SettingsAccountsMessageAutoCreationIcon } from '@/settings/accounts/components/SettingsAccountsMessageAutoCreationIcon';
import { SettingsAccountsRadioSettingsCard } from '@/settings/accounts/components/SettingsAccountsRadioSettingsCard';
import { msg } from '~/utils/i18n/badesI18n';
import { MessageChannelContactAutoCreationPolicy } from 'shared/types';

type SettingsAccountsMessageAutoCreationCardProps = {
  onChange: (nextValue: MessageChannelContactAutoCreationPolicy) => void;
  value?: MessageChannelContactAutoCreationPolicy;
};

const autoCreationOptions = [
  {
    title: msg`Terkirim dan Diterima`,
    description: msg`Orang-orang yang saya kirimi email dan yang mengirim email kepada saya.`,
    value: MessageChannelContactAutoCreationPolicy.SENT_AND_RECEIVED,
    cardMedia: (
      <SettingsAccountsMessageAutoCreationIcon isSentActive isReceivedActive />
    ),
  },
  {
    title: msg`Terkirim`,
    description: msg`Orang-orang yang saya kirimi email.`,
    value: MessageChannelContactAutoCreationPolicy.SENT,
    cardMedia: <SettingsAccountsMessageAutoCreationIcon isSentActive />,
  },
  {
    title: msg`Tidak ada`,
    description: msg`Jangan buat kontak otomatis.`,
    value: MessageChannelContactAutoCreationPolicy.NONE,
    cardMedia: (
      <SettingsAccountsMessageAutoCreationIcon
        isSentActive={false}
        isReceivedActive={false}
      />
    ),
  },
];

export const SettingsAccountsMessageAutoCreationCard = ({
  onChange,
  value = MessageChannelContactAutoCreationPolicy.SENT_AND_RECEIVED,
}: SettingsAccountsMessageAutoCreationCardProps) => (
  <SettingsAccountsRadioSettingsCard
    name="message-auto-creation"
    options={autoCreationOptions}
    value={value}
    onChange={onChange}
  />
);
