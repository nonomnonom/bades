import { SettingsAccountsMessageFoldersCard } from '@/settings/accounts/components/message-folders/SettingsAccountsMessageFoldersCard';
import { SettingsAccountsMessageFolderIcon } from '@/settings/accounts/components/SettingsAccountsMessageFolderIcon';
import { SettingsAccountsRadioSettingsCard } from '@/settings/accounts/components/SettingsAccountsRadioSettingsCard';
import { msg } from '~/utils/i18n/badesI18n';
import { MessageFolderImportPolicy } from 'shared/types';

type SettingsAccountsMessageFolderCardProps = {
  onChange: (nextValue: MessageFolderImportPolicy) => void;
  value?: MessageFolderImportPolicy;
};

const INBOX_SETTINGS_VISIBILITY_OPTIONS = [
  {
    title: msg`Semua`,
    description: msg`Impor semua email`,
    value: MessageFolderImportPolicy.ALL_FOLDERS,
    cardMedia: (
      <SettingsAccountsMessageFolderIcon
        value={MessageFolderImportPolicy.ALL_FOLDERS}
      />
    ),
  },
  {
    title: msg`Beberapa folder`,
    description: msg`Impor hanya folder/label yang dipilih`,
    value: MessageFolderImportPolicy.SELECTED_FOLDERS,
    cardMedia: (
      <SettingsAccountsMessageFolderIcon
        value={MessageFolderImportPolicy.SELECTED_FOLDERS}
      />
    ),
    cardContentExpanded: <SettingsAccountsMessageFoldersCard />,
  },
];

export const SettingsAccountsMessageFolderCard = ({
  onChange,
  value = MessageFolderImportPolicy.SELECTED_FOLDERS,
}: SettingsAccountsMessageFolderCardProps) => (
  <SettingsAccountsRadioSettingsCard
    name="message-folder-import-policy"
    options={INBOX_SETTINGS_VISIBILITY_OPTIONS}
    value={value}
    onChange={onChange}
  />
);
